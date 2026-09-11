import { RenderedCard, TeammateProfile } from '@/types';

/**
 * Format a localized card into a rich WhatsApp message
 */
export function formatWhatsAppMessage(card: RenderedCard, teammate?: TeammateProfile): string {
  const parts: string[] = [];

  // Header
  parts.push(`📢 *${card.rendered_headline}* (${card.language_label})`);
  parts.push('────────────────────────');
  
  // Body text
  parts.push(card.rendered_body);
  parts.push('');

  // Locked commitments
  const { owner, deadline, conditions } = card.displayed_locked_fields;
  const hasCommitments = 
    (owner && owner !== 'Unassigned') || 
    (deadline && deadline !== 'No deadline') || 
    (conditions && conditions.length > 0);

  if (hasCommitments) {
    parts.push('🔒 *Locked Commitments (Verified by Bhasha):*');
    if (owner && owner !== 'Unassigned') {
      parts.push(`• 👤 *Assignee:* ${owner}`);
    }
    if (deadline && deadline !== 'No deadline') {
      parts.push(`• ⏱ *Time / Deadline:* ${deadline}`);
    }
    if (conditions && conditions.length > 0) {
      parts.push(`• ⚡ *Prerequisite:* ${conditions[0]}`);
    }
    parts.push('');
  }

  parts.push('_Delivered via Bhasha — Zero-Drift Multilingual Relay_');

  return parts.join('\n');
}

/**
 * Generate a direct WhatsApp link for an individual phone number or universal group share
 */
export function getWhatsAppDispatchUrl(
  card: RenderedCard,
  teammate?: TeammateProfile,
  forceGroup: boolean = false
): string {
  const message = formatWhatsAppMessage(card, teammate);
  const encodedText = encodeURIComponent(message);

  // If forceGroup is true, or teammate is a group or has no phone number -> universal group picker
  if (forceGroup || teammate?.recipient_type === 'group' || !teammate?.whatsapp_number) {
    return `https://api.whatsapp.com/send?text=${encodedText}`;
  }

  // Clean phone number (remove +, spaces, dashes)
  const cleanPhone = teammate.whatsapp_number.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Format an email subject and body
 */
export function getEmailDispatchUrl(card: RenderedCard, teammate?: TeammateProfile): string {
  const recipient = teammate?.email || '';
  const subject = encodeURIComponent(`[Bhasha Relay] ${card.rendered_headline} (${card.language_label})`);
  
  const bodyParts: string[] = [];
  bodyParts.push(card.rendered_headline);
  bodyParts.push('='.repeat(card.rendered_headline.length));
  bodyParts.push('');
  bodyParts.push(card.rendered_body);
  bodyParts.push('');

  const { owner, deadline, conditions } = card.displayed_locked_fields;
  if ((owner && owner !== 'Unassigned') || (deadline && deadline !== 'No deadline') || (conditions && conditions.length > 0)) {
    bodyParts.push('LOCKED COMMITMENTS (ZERO DRIFT VERIFIED):');
    if (owner && owner !== 'Unassigned') bodyParts.push(`• Assignee: ${owner}`);
    if (deadline && deadline !== 'No deadline') bodyParts.push(`• Time / Deadline: ${deadline}`);
    if (conditions && conditions.length > 0) bodyParts.push(`• Condition: ${conditions[0]}`);
    bodyParts.push('');
  }

  bodyParts.push('---');
  bodyParts.push('Sent via Bhasha — Voice-first task handoff for multilingual teams.');

  const body = encodeURIComponent(bodyParts.join('\n'));
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}
