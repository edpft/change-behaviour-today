import { describe, it, expect, beforeAll } from 'vitest';
import yaml from 'js-yaml';
import fs from 'fs';

let html;
let content;

beforeAll(() => {
  const htmlPath = 'dst/index.html';
  if (!fs.existsSync(htmlPath)) {
    throw new Error('dst/index.html not found — run `npm run build` first');
  }
  html = fs.readFileSync(htmlPath, 'utf8');
  content = yaml.load(fs.readFileSync('src/_data/content.yaml', 'utf8'));
});

describe('built HTML — template rendering', () => {
  it('contains no unresolved Handlebars templates', () => {
    expect(html).not.toMatch(/\{\{/);
  });
});

describe('built HTML — contact details', () => {
  it('contains the phone number', () => {
    expect(html).toContain(content.contact.phone);
  });

  it('contains the email address', () => {
    expect(html).toContain(content.contact.email);
  });

  it('contains the BABCP membership number', () => {
    expect(html).toContain(content.contact.babcp_membership_number);
  });

  it('phone link uses correct international format', () => {
    const international = content.contact.phone.replace(/^0/, '+44');
    expect(html).toContain(`href="tel:${international}"`);
  });
});

describe('built HTML — fees', () => {
  it('contains every fee label and price', () => {
    for (const row of content.fees.rows) {
      expect(html).toContain(row.label);
      expect(html).toContain(row.price);
    }
  });

  it('contains the payment note', () => {
    expect(html).toContain(content.fees.payment_note);
  });
});

describe('built HTML — page structure', () => {
  it('has all required section IDs', () => {
    const sections = [
      'how-i-work',
      'contact-details',
      'fees',
      'about-me',
      'what-is-cbt',
    ];
    for (const id of sections) {
      expect(html, `missing section id="${id}"`).toContain(`id="${id}"`);
    }
  });
});
