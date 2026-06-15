/**
 * vCard parser — handles 3.0 and 4.0 formats.
 */

/**
 * Parse a vCard string into a structured contact object.
 *
 * @param {string} vcf — raw vCard text
 * @returns {object} parsed contact
 */
export function parseVCard(vcf) {
  const lines = unfoldLines(vcf.trim().split(/\r?\n/));
  const contact = {
    fullName: null,
    phones: [],
    birthday: null,
    timezone: null,
    address: null,
    email: null,
    org: null,
  };

  for (const line of lines) {
    const [prop, value] = splitProperty(line);
    const propUpper = prop.toUpperCase();

    if (propUpper === 'FN') {
      contact.fullName = value;
    } else if (propUpper.startsWith('TEL')) {
      contact.phones.push({
        type: extractType(prop),
        number: value,
      });
    } else if (propUpper === 'BDAY') {
      contact.birthday = parseBirthday(value);
    } else if (propUpper === 'TZ') {
      contact.timezone = value;
    } else if (propUpper.startsWith('ADR')) {
      contact.address = parseAddress(value, prop);
    } else if (propUpper.startsWith('EMAIL')) {
      contact.email = value;
    } else if (propUpper === 'ORG') {
      contact.org = value;
    }
  }

  return contact;
}

/**
 * Unfold continuation lines (RFC 6350 §3.2).
 */
function unfoldLines(lines) {
  const result = [];
  for (const line of lines) {
    if (line.startsWith(' ') || line.startsWith('\t')) {
      if (result.length > 0) {
        result[result.length - 1] += line.slice(1);
      }
    } else {
      result.push(line);
    }
  }
  return result;
}

/**
 * Split a property line into property name and value.
 */
function splitProperty(line) {
  const colonIdx = line.indexOf(':');
  if (colonIdx === -1) return [line, ''];
  return [line.slice(0, colonIdx), line.slice(colonIdx + 1)];
}

/**
 * Parse a BDAY value.
 */
function parseBirthday(value) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/) || value.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (!match) return null;
  return value;
}

/**
 * Parse an ADR value into structured components.
 * ADR format: PO;Extended;Street;City;Region;Postal;Country
 */
function parseAddress(value, prop) {
  const parts = value.split(';');
  const type = extractType(prop);
  return {
    type: type,
    poBox: parts[0] || null,
    extended: parts[1] || null,
    street: parts[2] || null,
    city: parts[3] || null,
    region: parts[4] || null,
    postal: parts[5] || null,
    country: parts[6] || null,
  };
}

/**
 * Extract TYPE parameter from a property name.
 * e.g. "TEL;TYPE=cell" → "cell"
 *      "ADR;TYPE=home" → "home"
 */
function extractType(prop) {
  const typeMatch = prop.match(/TYPE=([^;:]+)/i);
  return typeMatch ? typeMatch[1].toLowerCase() : null;
}
