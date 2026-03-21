import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.APP_URL ?? 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '.');
const URLS_FILE  = path.join(__dirname, '../tmp/screenshot_urls.json');

const urls = JSON.parse(readFileSync(URLS_FILE, 'utf-8'));

async function capture(page, filename) {
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(OUTPUT_DIR, filename) });
  console.log(`Captured: ${filename}`);
}

(async () => {
  const browser = await chromium.launch();

  // --- Default context (no theme) ---
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  // Login
  await page.goto(`${BASE_URL}/users/sign_in`);
  await page.fill('[name="user[login]"]', 'admin@example.com');
  await page.fill('[name="user[password]"]', 'password');
  await page.click('[type="submit"]');
  await page.waitForLoadState('networkidle');

  // Backlogs
  await page.goto(`${BASE_URL}${urls.backlogs_url}`);
  await capture(page, 'backlogs.png');

  // Kanban
  await page.goto(`${BASE_URL}${urls.kanban_url}`);
  await capture(page, 'kanban.png');

  await context.close();

  // --- Theme screenshots (localStorage でテーマを注入) ---
  const themes = [
    { key: 'clean-slate', filename: 'theme_clean_slate.png' },
    { key: 'solar-dusk',  filename: 'theme_solar_dusk.png'  },
  ];

  for (const theme of themes) {
    const themeContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      storageState: {
        cookies: await context.cookies().catch(() => []),
        origins: [
          {
            origin: BASE_URL,
            localStorage: [{ name: 'demo-theme', value: theme.key }],
          },
        ],
      },
    });

    // ログイン済み cookie を引き継ぐため再ログイン
    const themePage = await themeContext.newPage();
    await themePage.goto(`${BASE_URL}/users/sign_in`);
    await themePage.fill('[name="user[login]"]', 'admin@example.com');
    await themePage.fill('[name="user[password]"]', 'password');
    await themePage.click('[type="submit"]');
    await themePage.waitForLoadState('networkidle');

    await themePage.goto(`${BASE_URL}${urls.backlogs_url}`);
    await capture(themePage, theme.filename);

    await themeContext.close();
  }

  await browser.close();
})();
