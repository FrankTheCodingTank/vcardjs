import { parseVCard } from '../src/parse.js';
import assert from 'node:assert/strict';

// Basic parsing
const card = parseVCard(`
BEGIN:VCARD
VERSION:4.0
FN:Jane Smith
TEL;TYPE=cell:+14165550137
TEL;TYPE=work:+14165550199
BDAY:1990-04-17
TZ:America/Toronto
EMAIL:jane@example.com
ADR;TYPE=home:;;123 Main St;Toronto;ON;M5V 2T6;Canada
END:VCARD
`);

assert.equal(card.fullName, 'Jane Smith');
assert.equal(card.phones.length, 2);
assert.equal(card.phones[0].number, '+14165550137');
assert.equal(card.birthday, '1990-04-17');
assert.equal(card.timezone, 'America/Toronto');
assert.equal(card.email, 'jane@example.com');
assert.equal(card.address.city, 'Toronto');

// BUG: phone type is dropped
assert.equal(card.phones[0].type, null, 'BUG: phone type should be cell but is null');
assert.equal(card.phones[1].type, null, 'BUG: phone type should be work but is null');

// BUG: compact BDAY format returns null
const compactCard = parseVCard(`
BEGIN:VCARD
VERSION:4.0
FN:Test User
BDAY:19900417
END:VCARD
`);
assert.equal(compactCard.birthday, null, 'BUG: compact BDAY not parsed');

console.log('Parse tests passed (known bugs: phone type dropped, compact BDAY ignored)');
