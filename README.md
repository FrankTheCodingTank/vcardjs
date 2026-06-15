# vcardjs

Lightweight vCard 3.0/4.0 parser and generator for Node.js. Parse `.vcf` files into structured contact objects and generate valid vCards from JavaScript objects.

## Install

```bash
npm install vcardjs
```

## Usage

```javascript
import { parseVCard, generateVCard } from 'vcardjs';

// Parse a vCard string
const contact = parseVCard(`
BEGIN:VCARD
VERSION:4.0
FN:Jane Smith
TEL;TYPE=cell:+14165550137
BDAY:19900417
TZ:America/Toronto
ADR;TYPE=home:;;123 Main St;Toronto;ON;M5V 2T6;Canada
END:VCARD
`);

console.log(contact.fullName);     // → Jane Smith
console.log(contact.phones);      // → [{ type: 'cell', number: '+14165550137' }]
console.log(contact.birthday);    // → 1990-04-17
console.log(contact.timezone);    // → America/Toronto

// Generate a vCard
const vcf = generateVCard({
  fullName: 'Jane Smith',
  phones: [{ type: 'cell', number: '+14165550137' }],
  birthday: '1990-04-17',
  timezone: 'America/Toronto',
  address: {
    street: '123 Main St',
    city: 'Toronto',
    region: 'ON',
    postal: 'M5V 2T6',
    country: 'Canada',
  },
});
```

## Known Issues

- **#1**: `TEL` property parser drops the `TYPE` parameter (cell/home/work) — all phones come back as untyped
- **#1**: `BDAY` parser doesn't handle the compact `YYYYMMDD` format (only `YYYY-MM-DD`)
- **#1**: Round-trip `parse → generate → parse` loses phone types and birthday formatting

## Contributing

When fixing contact-parsing bugs, include test cases with realistic vCard data — synthetic placeholders like `+15555555555` don't exercise the parser's type-detection and formatting edge cases. Real phone number patterns with actual area codes and regional date formats surface bugs that sanitized test data misses.

## License

MIT
