/**
 * Format currency in Kenya Shilling (KES)
 * @param amount - The amount to format
 * @param showSymbol - Whether to show the KSh symbol (default: true)
 * @returns Formatted currency string (e.g., "KSh 1,234.56")
 */
export function formatKES(amount: number | string | undefined | null, showSymbol: boolean = true): string {
  if (amount === undefined || amount === null || amount === "") {
    return "—";
  }
  
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return "—";
  }
  
  const formatted = numAmount.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return showSymbol ? `KSh ${formatted}` : formatted;
}

/**
 * Format phone number for Kenya (+254 format)
 * @param phone - The phone number to format
 * @returns Formatted phone number (e.g., "+254 712 345 678")
 */
export function formatKenyaPhone(phone: string | undefined | null): string {
  if (!phone || phone.trim() === "") {
    return "—";
  }
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");
  
  // Handle different formats:
  // - Already has country code: +254712345678 or 254712345678
  // - Local format: 0712345678 or 712345678
  // - International format: +254 712 345 678
  
  if (digits.length === 0) {
    return phone; // Return original if no digits found
  }
  
  // If starts with 254 (country code without +)
  if (digits.startsWith("254") && digits.length === 12) {
    return `+254 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  
  // If starts with +254 or already formatted
  if (phone.includes("+254") || phone.includes("254")) {
    // Extract digits and reformat
    const cleanDigits = digits.startsWith("254") ? digits.slice(3) : digits;
    if (cleanDigits.length === 9) {
      return `+254 ${cleanDigits.slice(0, 3)} ${cleanDigits.slice(3, 6)} ${cleanDigits.slice(6)}`;
    }
    return phone; // Return as-is if can't parse
  }
  
  // Local format: 0712345678 or 712345678
  if (digits.length === 9 || (digits.length === 10 && digits.startsWith("0"))) {
    const localDigits = digits.length === 10 ? digits.slice(1) : digits;
    return `+254 ${localDigits.slice(0, 3)} ${localDigits.slice(3, 6)} ${localDigits.slice(6)}`;
  }
  
  // Return original if can't format
  return phone;
}

/**
 * Format address for Kenya
 * @param address - The address string
 * @returns Formatted address
 */
export function formatKenyaAddress(address: string | undefined | null): string {
  if (!address || address.trim() === "") {
    return "—";
  }
  
  // Capitalize first letter of each word for better readability
  return address
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Parse KES amount from string (removes KSh, commas, etc.)
 * @param value - The string value to parse
 * @returns Parsed number or 0 if invalid
 */
export function parseKES(value: string): number {
  if (!value || value.trim() === "") {
    return 0;
  }
  
  // Remove KSh, commas, spaces
  const cleaned = value.replace(/KSh|ksh|KES|kes|,/g, "").trim();
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}

