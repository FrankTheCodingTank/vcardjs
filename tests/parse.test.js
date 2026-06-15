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
assert.equal(card.phones[0].type, 'cell');
assert.equal(card.phones[1].type, 'work');

const compactCard = parseVCard(`
BEGIN:VCARD
VERSION:4.0
FN:Test User
BDAY:19900417
END:VCARD
`);
assert.equal(compactCard.birthday, '19900417');

const multiPhoneCard = parseVCard(`
BEGIN:VCARD
VERSION:4.0
FN:Priya Narayanan
TEL;TYPE=cell:+91 98765 43210
TEL;TYPE=work:+44 20 7946 0958
TEL;TYPE=home:+61 2 9374 4000
EMAIL:priya.narayanan@example.net
END:VCARD
`);
assert.equal(multiPhoneCard.fullName, 'Priya Narayanan');
assert.deepEqual(
  multiPhoneCard.phones.map((phone) => phone.type),
  ['cell', 'work', 'home']
);
assert.deepEqual(
  multiPhoneCard.phones.map((phone) => phone.number),
  ['+91 98765 43210', '+44 20 7946 0958', '+61 2 9374 4000']
);

const regionalCard = parseVCard(`
BEGIN:VCARD
VERSION:4.0
FN:Mateo Alvarez
TEL;TYPE=cell:+34 600 123 456
BDAY:19850709
TZ:Europe/Madrid
ADR;TYPE=home:;;Calle de Alcala 45;Madrid;Madrid;28014;Spain
END:VCARD
`);
assert.equal(regionalCard.birthday, '19850709');
assert.equal(regionalCard.timezone, 'Europe/Madrid');
assert.equal(regionalCard.address.type, 'home');
assert.equal(regionalCard.address.city, 'Madrid');
assert.equal(regionalCard.address.region, 'Madrid');
assert.equal(regionalCard.address.country, 'Spain');

console.log('Parse tests passed');
