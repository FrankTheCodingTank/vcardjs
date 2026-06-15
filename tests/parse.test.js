import { parseVCard } from '../src/parse.js';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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

const contributorFixture = parseVCard(readFileSync(new URL('../samples/contributor.vcf', import.meta.url), 'utf8'));
assert.equal(contributorFixture.fullName, 'Amina Patel');
assert.deepEqual(
  contributorFixture.phones.map((phone) => phone.type),
  ['cell', 'work', 'home'],
);
assert.equal(contributorFixture.birthday, '19880417');
assert.equal(contributorFixture.timezone, 'America/Toronto');
assert.equal(contributorFixture.address.city, 'Toronto');
assert.equal(contributorFixture.address.region, 'ON');
assert.equal(contributorFixture.address.country, 'Canada');

console.log('Parse tests passed');
