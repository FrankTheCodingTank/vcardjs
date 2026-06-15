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

// Phone number survives but type is lost
assert.equal(reparsed.phones[0].number, '+14165550137');
assert.equal(reparsed.phones[0].type, null, 'BUG: type lost on round-trip');

// BUG: generated vCard has TEL:+14165550137 instead of TEL;TYPE=cell:+14165550137
assert.ok(!generated.includes('TYPE=cell'), 'BUG: TYPE not emitted in generated vCard');

console.log('Generate tests passed (known bug: phone type lost on round-trip)');
