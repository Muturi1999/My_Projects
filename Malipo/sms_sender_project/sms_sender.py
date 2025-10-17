import africastalking
import pandas as pd
import time
from datetime import datetime
from config import (
    AT_USERNAME, 
    AT_API_KEY, 
    AT_SENDER_ID,
    CONTACTS_FILE,
    MESSAGE_TEMPLATE,
    DELAY_BETWEEN_SMS
)

# Initialize Africa's Talking
print("Initializing Africa's Talking...")
africastalking.initialize(AT_USERNAME, AT_API_KEY)
sms = africastalking.SMS
print("✓ Initialized successfully\n")

# Load contacts from Excel
def load_contacts(file_path):
    try:
        df = pd.read_excel(file_path)
        print(f"✓ Loaded Excel file: {file_path}")
        
        # Find name and phone columns
        name_col = None
        phone_col = None
        
        for col in df.columns:
            if col.lower() in ['name', 'full name', 'fullname']:
                name_col = col
            if col.lower() in ['phone', 'phonenumber', 'phone number', 'mobile']:
                phone_col = col
        
        if not name_col or not phone_col:
            print("✗ Could not find Name and Phone columns")
            return None
        
        contacts = []
        for _, row in df.iterrows():
            if pd.notna(row[name_col]) and pd.notna(row[phone_col]):
                name = str(row[name_col]).strip()
                phone = str(row[phone_col]).strip()
                
                # Format phone number
                phone = phone.replace(" ", "").replace("-", "")
                if phone.startswith('0'):
                    phone = '+254' + phone[1:]
                elif not phone.startswith('+'):
                    phone = '+254' + phone
                
                contacts.append({'name': name, 'phone': phone})
        
        print(f"✓ Loaded {len(contacts)} contacts\n")
        return contacts
    
    except Exception as e:
        print(f"✗ Error loading contacts: {e}")
        return None

# Send SMS
def send_sms(recipient, message):
    try:
        response = sms.send(message, [recipient], AT_SENDER_ID)
        if response['SMSMessageData']['Recipients']:
            status = response['SMSMessageData']['Recipients'][0].get('status')
            return status == 'Success', status
        return False, "No response"
    except Exception as e:
        return False, str(e)

# Bulk send
def bulk_send(contacts, template):
    total = len(contacts)
    successful = 0
    failed = 0
    results = []
    
    print(f"{'='*60}")
    print(f"Sending to {total} contacts...")
    print(f"{'='*60}\n")
    
    for i, contact in enumerate(contacts, 1):
        name = contact['name']
        phone = contact['phone']
        message = template.format(name=name)
        
        print(f"[{i}/{total}] {name} ({phone})...", end=" ")
        
        success, status = send_sms(phone, message)
        
        if success:
            print("✓ Sent")
            successful += 1
        else:
            print(f"✗ Failed: {status}")
            failed += 1
        
        results.append({
            'name': name,
            'phone': phone,
            'status': 'Success' if success else 'Failed',
            'message': status,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
        
        if i < total:
            time.sleep(DELAY_BETWEEN_SMS)
    
    print(f"\n{'='*60}")
    print(f"SUMMARY: Total: {total} | Success: {successful} | Failed: {failed}")
    print(f"{'='*60}\n")
    
    # Save results
    df = pd.DataFrame(results)
    filename = f"results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    df.to_excel(filename, index=False)
    print(f"✓ Results saved to: {filename}")

# Preview
def preview(contacts, template, num=3):
    print(f"\n{'='*60}")
    print(f"MESSAGE PREVIEW")
    print(f"{'='*60}\n")
    
    for i, contact in enumerate(contacts[:num], 1):
        message = template.format(name=contact['name'])
        print(f"Contact {i}: {contact['name']} ({contact['phone']})")
        print(f"{'-'*60}")
        print(message)
        print(f"{'='*60}\n")

# Main
def main():
    print("\n" + "="*60)
    print("AFRICA'S TALKING BULK SMS SENDER")
    print("="*60 + "\n")
    
    contacts = load_contacts(CONTACTS_FILE)
    
    if not contacts:
        print("✗ No contacts loaded. Exiting...")
        return
    
    preview(contacts, MESSAGE_TEMPLATE)
    
    response = input("Send SMS to all contacts? (yes/no): ").lower().strip()
    
    if response in ['yes', 'y']:
        bulk_send(contacts, MESSAGE_TEMPLATE)
    else:
        print("\n✗ Cancelled by user")

if __name__ == "__main__":
    main()
