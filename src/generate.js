/**
 * vCard generator — produces valid 4.0 vCards from contact objects.
 *
 * BUG (#1): generateVCard doesn't emit TYPE on TEL lines because
 * parseVCard drops it (the type field is always null after parsing).
 * Round-trip parse → generate → parse loses phone types.
 */

/**
 * Generate a vCard 4.0 string from a contact object.
 *
 * @param {object} contact
 * @returns {string} vCard text
 */
export function generateVCard(contact) {
  const lines = ['BEGIN:VCARD', 'VERSION:4.0'];

  if (contact.fullName) {
    lines.push(`FN:${contact.fullName}`);
  }

  if (contact.phones) {
    for (const phone of contact.phones) {
      // BUG: type is null from parser, so TYPE is never emitted
      if (phone.type) {
        lines.push(`TEL;TYPE=${phone.type}:${phone.number}`);
      } else {
        lines.push(`TEL:${phone.number}`);
      }
    }
  }

  if (contact.birthday) {
    lines.push(`BDAY:${contact.birthday}`);
  }

  if (contact.timezone) {
    lines.push(`TZ:${contact.timezone}`);
  }

  if (contact.email) {
    lines.push(`EMAIL:${contact.email}`);
  }

  if (contact.org) {
    lines.push(`ORG:${contact.org}`);
  }

  if (contact.address) {
    const a = contact.address;
    const type = a.type ? `;TYPE=${a.type}` : '';
    lines.push(`ADR${type}:${a.poBox || ''};${a.extended || ''};${a.street || ''};${a.city || ''};${a.region || ''};${a.postal || ''};${a.country || ''}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}
