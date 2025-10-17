// server.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const bodyParser = require('body-parser');
const path = require('path');

const AT = require('africastalking')({
  username: process.env.AT_USERNAME,
  apiKey: process.env.AT_API_KEY
});
const sms = AT.SMS;

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

/**
 * Helpers
 */
// normalize phone numbers to +2547XXXXXXXX
function normalizeNumber(raw) {
  if (!raw) return null;
  let s = String(raw).trim();
  // Remove spaces, dashes, parentheses
  s = s.replace(/[\s\-()]/g, '');
  // If starts with 0 and 9 or 10 digits: 07..., convert to +2547...
  if (/^0(7|1|2|5|9)\d{7,8}$/.test(s)) {
    return '+254' + s.substring(1);
  }
  // If starts with 7 and 9 digits e.g. 7XXXXXXXX
  if (/^7\d{8}$/.test(s)) {
    return '+254' + s;
  }
  // If starts with 254 (no +)
  if (/^2547\d{8}$/.test(s)) {
    return '+' + s;
  }
  // If already +254...
  if (/^\+2547\d{8}$/.test(s)) {
    return s;
  }
  // If international with + and other code, return as-is
  if (/^\+\d{6,15}$/.test(s)) return s;
  return null; // invalid
}

// parse uploaded file (xlsx or csv). Expect columns: name, phone (case-insensitive)
function parseContactsFromFile(filepath) {
  const wb = xlsx.readFile(filepath);
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const json = xlsx.utils.sheet_to_json(sheet, { defval: '' });
  // Try to map columns to name & phone
  const contacts = json.map(row => {
    // find phone field (phone, Phone, mobile, Mobile, msisdn)
    const phoneKey = Object.keys(row).find(k => /phone|mobile|msisdn|number/i.test(k));
    const nameKey = Object.keys(row).find(k => /name|fullname|first|last/i.test(k));
    const name = nameKey ? row[nameKey] : (row.name || row.fullname || '');
    const phone = phoneKey ? row[phoneKey] : (row.phone || row.mobile || row.number || '');
    return { name: name ? String(name).trim() : '', phone: String(phone).trim() };
  });
  return contacts;
}

/**
 * Routes
 */

app.get('/', (req, res) => {
  res.render('index', { results: null, preview: null, errors: null });
});

app.post('/upload-and-send', upload.single('contactsFile'), async (req, res) => {
  try {
    const { message, pastedNumbers } = req.body;
    if (!message || message.trim().length === 0) {
      return res.render('index', { results: null, preview: null, errors: ['Message cannot be empty'] });
    }

    let contacts = [];

    // If file uploaded, parse it
    if (req.file) {
      const parsed = parseContactsFromFile(req.file.path);
      contacts = contacts.concat(parsed);
    }

    // If numbers pasted manually, parse them (newline or comma-separated; optional name before comma `Name,2547...`)
    if (pastedNumbers && pastedNumbers.trim().length) {
      const lines = pastedNumbers.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        // Accept "Name,number" or just number
        const parts = line.split(',');
        if (parts.length >= 2) {
          contacts.push({ name: parts[0].trim(), phone: parts[1].trim() });
        } else {
          // maybe just a number
          contacts.push({ name: '', phone: parts[0].trim() });
        }
      }
    }

    // Basic dedupe based on normalized number
    const uniq = {};
    const prepared = [];
    for (const c of contacts) {
      const normalized = normalizeNumber(c.phone);
      if (!normalized) continue; // skip invalid
      if (!uniq[normalized]) {
        uniq[normalized] = true;
        prepared.push({ name: c.name || '', phone: normalized });
      }
    }

    if (prepared.length === 0) {
      return res.render('index', { results: null, preview: null, errors: ['No valid contacts found. Ensure phone numbers are Kenya +254 or start with 07 or 7 followed by 9 digits.'] });
    }

    // Prepare sending results array
    const results = [];

    // Function to create personalized message: replace {{name}} or {{username}} or {{Name}}
    function personalize(template, name, phone) {
      const safeName = (name && name.length) ? name : '';
      return template.replace(/{{\s*(name|username|Name|USERNAME)\s*}}/g, safeName).replace(/{{\s*phone\s*}}/g, phone);
    }

    // Send SMS one by one (personalized). You could batch by grouping identical messages, but personalization requires per-number send.
    for (const c of prepared) {
      const personalized = personalize(message, c.name, c.phone);

      try {
        // africa's talking expects recipients as comma-separated string or array
        const response = await sms.send({
          to: [c.phone],
          message: personalized,
          from: null // optional sender ID (requires registration); otherwise defaults to AT short code
        });
        // The response contains recipients array with status; we'll mark success if API returned recipients
        results.push({ phone: c.phone, name: c.name, success: true, response });
      } catch (err) {
        // push error
        results.push({ phone: c.phone, name: c.name, success: false, error: err.message || err });
      }
    }

    // Render results
    res.render('index', { results, preview: prepared.slice(0, 200), errors: null });
  } catch (err) {
    console.error(err);
    res.render('index', { results: null, preview: null, errors: [String(err.message || err)] });
  }
});

/**
 * Simple USSD webhook example (Africa's Talking)
 *
 * Africa's Talking will POST fields: sessionId, serviceCode, phoneNumber, text
 * We'll present a tiny menu to trigger sending to a predefined list name.
 *
 * NOTE: This is optional; configure your Africa's Talking USSD callback to point to /ussd
 */
app.post('/ussd', (req, res) => {
  // make sure your server accepts application/x-www-form-urlencoded
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  // USSD flow:
  // text == "" -> show menu
  // text == "1" -> start send flow (you might trigger a server-side job here)
  // Respond with: CON <text> for continuing, END <text> to finish
  if (text === '') {
    // first request
    res.send('CON Welcome to Bulk Sender\n1. Send today\'s broadcast\n2. Exit');
  } else if (text === '1') {
    // Example: trigger a send (in real use you should confirm and secure this)
    // For demo we just end
    res.send('END Broadcast queued. You will receive confirmation.');
    // Here you could trigger a server-side function to send a preconfigured message/list
  } else {
    res.send('END Thank you.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
