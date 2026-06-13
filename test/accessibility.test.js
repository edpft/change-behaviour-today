// @vitest-environment jsdom
import { beforeAll, describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import axe from 'axe-core';

beforeAll(() => {
  const htmlPath = 'dst/index.html';
  if (!existsSync(htmlPath)) {
    throw new Error('dst/index.html not found — run `npm run build` first');
  }
  const html = readFileSync(htmlPath, 'utf-8');
  document.open();
  document.write(html);
  document.close();
});

describe('accessibility (axe)', () => {
  it('has no violations', async () => {
    const { violations } = await axe.run(document);
    if (violations.length > 0) {
      const report = violations
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.description}\n  Nodes: ${v.nodes.map((n) => n.html).join(', ')}`,
        )
        .join('\n');
      expect.fail(`${violations.length} axe violation(s):\n${report}`);
    }
  });
});
