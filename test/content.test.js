import { describe, it, expect } from 'vitest';
import yaml from 'js-yaml';
import fs from 'fs';

const content = yaml.load(fs.readFileSync('src/_data/content.yaml', 'utf8'));

describe('content.yaml — contact', () => {
  it('has a phone number', () => {
    expect(content.contact.phone).toBeTruthy();
  });

  it('has an email address', () => {
    expect(content.contact.email).toBeTruthy();
  });

  it('has a BABCP membership number', () => {
    expect(content.contact.babcp_membership_number).toBeTruthy();
  });
});

describe('content.yaml — fees', () => {
  it('has at least one fee row', () => {
    expect(content.fees.rows).toBeInstanceOf(Array);
    expect(content.fees.rows.length).toBeGreaterThan(0);
  });

  it('every fee row has a label and a price', () => {
    for (const row of content.fees.rows) {
      expect(row.label, 'fee row is missing a label').toBeTruthy();
      expect(
        row.price,
        `fee row "${row.label}" is missing a price`,
      ).toBeTruthy();
    }
  });

  it('has a payment note', () => {
    expect(content.fees.payment_note).toBeTruthy();
  });
});

describe('content.yaml — how I work', () => {
  it('has an intro paragraph', () => {
    expect(content.how_i_work.intro).toBeTruthy();
  });

  it('has at least one therapy listed', () => {
    expect(content.how_i_work.therapies).toBeInstanceOf(Array);
    expect(content.how_i_work.therapies.length).toBeGreaterThan(0);
  });
});

describe('content.yaml — about me', () => {
  it('has experience paragraphs', () => {
    expect(content.about_me.experience_paras).toBeInstanceOf(Array);
    expect(content.about_me.experience_paras.length).toBeGreaterThan(0);
  });

  it('has at least one condition listed', () => {
    expect(content.about_me.conditions).toBeInstanceOf(Array);
    expect(content.about_me.conditions.length).toBeGreaterThan(0);
  });

  it('has at least one qualification listed', () => {
    expect(content.about_me.qualifications).toBeInstanceOf(Array);
    expect(content.about_me.qualifications.length).toBeGreaterThan(0);
  });
});
