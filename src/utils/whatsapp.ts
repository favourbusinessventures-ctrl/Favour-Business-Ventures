import { BUSINESS_CONFIG } from '../config/business';

/**
 * Builds a direct WhatsApp click-to-chat URL with a pre-filled message.
 */
export function buildWhatsAppUrl(message: string, customNumber?: string): string {
  const number = customNumber || BUSINESS_CONFIG.whatsappNumberRaw;
  const encodedMessage = encodeURIComponent(message.trim());
  return `https://wa.me/${number}?text=${encodedMessage}`;
}

/**
 * Helper to generate order message for a specific product
 */
export function getProductOrderWhatsAppUrl(
  productName: string,
  category: string,
  selectedSize?: string,
  customNumber?: string
): string {
  let message = `Hello FAVORA, I would like to order *${productName}*`;
  if (selectedSize) {
    message += ` (Size / Quantity: *${selectedSize}*)`;
  }
  message += `. Please confirm current price and availability for delivery.`;
  return buildWhatsAppUrl(message, customNumber);
}

/**
 * Helper to generate customized order message from quick order modal or contact form
 */
export function getCustomOrderWhatsAppUrl(details: {
  productName: string;
  sizeOrPackage: string;
  quantity: number;
  customerName?: string;
  location?: string;
  notes?: string;
}, customNumber?: string): string {
  const lines: string[] = [
    `*NEW ORDER INQUIRY - FAVORA*`,
    `----------------------------------------`,
    `*Product:* ${details.productName}`,
    `*Package / Option:* ${details.sizeOrPackage}`,
    `*Quantity:* ${details.quantity}`,
  ];

  if (details.customerName?.trim()) {
    lines.push(`*Customer Name:* ${details.customerName.trim()}`);
  }

  if (details.location?.trim()) {
    lines.push(`*Delivery Destination:* ${details.location.trim()}`);
  }

  if (details.notes?.trim()) {
    lines.push(`*Special Instructions:* ${details.notes.trim()}`);
  }

  lines.push(`----------------------------------------`);
  lines.push(`Kindly let me know the total cost and payment/waybill details. Thank you!`);

  return buildWhatsAppUrl(lines.join('\n'), customNumber);
}

/**
 * Helper to generate order message for multiple shopping cart items
 */
export function getCartOrderWhatsAppUrl(
  items: Array<{
    productName: string;
    selectedOption: string;
    quantity: number;
    category?: string;
  }>,
  customNumber?: string,
  customerNotes?: string
): string {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const lines: string[] = [
    `*NEW SHOPPING CART ORDER — FAVORA*`,
    `----------------------------------------`,
    `*Selected Provisions (${items.length} items / ${totalQuantity} packs):*`,
    ...items.map((item, index) => `${index + 1}. *${item.productName}* (${item.selectedOption}) — Qty: *${item.quantity}*`),
    `----------------------------------------`,
  ];

  if (customerNotes?.trim()) {
    lines.push(`*Customer Notes / Destination:* ${customerNotes.trim()}`);
    lines.push(`----------------------------------------`);
  }

  lines.push(`Hello, I would like to place this order. Please confirm current pricing, availability, and delivery/waybill arrangements.`);

  return buildWhatsAppUrl(lines.join('\n'), customNumber);
}
