require('dotenv').config();
const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const cors = require('cors');
const AfricasTalking = require('africastalking');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Initialize Africa's Talking
const africasTalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

const sms = africasTalking.SMS;

// Helper function to format phone number
function formatPhoneNumber(phone, countryCode = '254') {
  // Remove all non-numeric characters
  phone = phone.toString().replace(/\D/g, '');
  
  // Remove leading zeros
  phone = phone.replace(/^0+/, '');
  
  // Remove country code if already present
  if (phone.startsWith(countryCode)) {
    phone = phone.substring(countryCode.length);
  }
  
  // Add country code with + prefix
  return `+${countryCode}${phone}`;
}

// Parse Excel file and extract contacts
function parseExcelFile(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  const contacts = data.map(row => {
    // Try to find phone and name columns (case insensitive)
    const phoneKey = Object.keys(row).find(key => 
      key.toLowerCase().includes('phone') || 
      key.toLowerCase().includes('mobile') || 
      key.toLowerCase().includes('number')
    );
    
    const nameKey = Object.keys(row).find(key => 
      key.toLowerCase().includes('name')
    );
    
    return {
      name: nameKey ? row[nameKey] : 'Customer',
      phone: phoneKey ? formatPhoneNumber(row[phoneKey]) : null
    };
  }).filter(contact => contact.phone); // Remove entries without phone numbers
  
  return contacts;
}

// Endpoint to upload and parse Excel file
app.post('/api/upload-contacts', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const contacts = parseExcelFile(req.file.path);
    
    // Clean up uploaded file
    const fs = require('fs');
    fs.unlinkSync(req.file.path);
    
    res.json({ 
      success: true, 
      contacts: contacts,
      count: contacts.length 
    });
  } catch (error) {
    console.error('Error parsing file:', error);
    res.status(500).json({ error: 'Error parsing file: ' + error.message });
  }
});

// Endpoint to send bulk SMS
app.post('/api/send-bulk-sms', async (req, res) => {
  try {
    const { contacts, message } = req.body;
    
    if (!contacts || contacts.length === 0) {
      return res.status(400).json({ error: 'No contacts provided' });
    }
    
    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }
    
    const results = {
      successful: [],
      failed: []
    };
    
    // Send SMS to each contact with personalized message
    for (const contact of contacts) {
      try {
        const personalizedMessage = `Dear ${contact.name},\n\n${message}`;
        
        const response = await sms.send({
          to: [contact.phone],
          message: personalizedMessage,
          from: process.env.AT_SENDER_ID || null
        });
        
        console.log(`SMS sent to ${contact.name} (${contact.phone}):`, response);
        
        results.successful.push({
          name: contact.name,
          phone: contact.phone,
          status: 'Sent',
          response: response.SMSMessageData.Recipients[0]
        });
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Failed to send to ${contact.name} (${contact.phone}):`, error.message);
        results.failed.push({
          name: contact.name,
          phone: contact.phone,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      total: contacts.length,
      successful: results.successful.length,
      failed: results.failed.length,
      results: results
    });
    
  } catch (error) {
    console.error('Error sending bulk SMS:', error);
    res.status(500).json({ error: 'Error sending SMS: ' + error.message });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Bulk SMS API is running',
    configured: !!(process.env.AT_USERNAME && process.env.AT_API_KEY)
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Open your browser and navigate to http://localhost:3000');
});