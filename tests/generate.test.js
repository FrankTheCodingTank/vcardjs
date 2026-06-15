import { parseVCard } from '../src/parse.js';
import { generateVCard } from '../src/generate.js';
import assert from 'node:assert/strict';

// Round-trip test
const original = `BEGIN:VCARD
VERSION:4.0
FN:Jane Smith
TEL;TYPE=cell:+14165550137
BDAY:1990-04-17
TZ:America/Toronto
END:VCARD`;

const parsed = parseVCard(original);
const generated = generateVCard(parsed);
const reparsed = parseVCard(generated);

// Name survives round-trip
assert.equal(reparsed.fullName, 'Jane Smith');

assert.equal(reparsed.phones[0].number, '+14165550137');
assert.equal(reparsed.phones[0].type, 'cell');
assert.ok(generated.includes('TEL;TYPE=cell:+14165550137'));

const roundTripCards = [
  {
    name: 'multiple regional phone types',
    vcf: `BEGIN:VCARD
VERSION:4.0
FN:Priya Narayanan
TEL;TYPE=cell:+91 98765 43210
TEL;TYPE=work:+44 20 7946 0958
TEL;TYPE=home:+61 2 9374 4000
EMAIL:priya.narayanan@example.net
END:VCARD`,
  },
  {
    name: 'compact birthday',
    vcf: `BEGIN:VCARD
VERSION:4.0
FN:Mateo Alvarez
TEL;TYPE=cell:+34 600 123 456
BDAY:19850709
END:VCARD`,
  },
  {
    name: 'timezone and structured address',
    vcf: `BEGIN:VCARD
VERSION:4.0
FN:Amina Haddad
TEL;TYPE=work:+971 4 555 0198
TZ:Asia/Dubai
ADR;TYPE=work:;;Sheikh Zayed Rd;Dubai;Dubai;00000;United Arab Emirates
END:VCARD`,
  },
];

for (const { name, vcf } of roundTripCards) {
  const reparsedCard = parseVCard(generateVCard(parseVCard(vcf)));
  const originalCard = parseVCard(vcf);

  assert.deepEqual(reparsedCard.phones, originalCard.phones, `${name}: phones round-trip`);
  assert.equal(reparsedCard.birthday, originalCard.birthday, `${name}: birthday round-trip`);
  assert.equal(reparsedCard.timezone, originalCard.timezone, `${name}: timezone round-trip`);
  assert.deepEqual(reparsedCard.address, originalCard.address, `${name}: address round-trip`);
}

console.log('Generate tests passed');
