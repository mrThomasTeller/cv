import { fileURLToPath } from 'url';
import path from 'path';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const htmlPath = path.join(__dirname, '../index.html');
const pdfPath = path.join(__dirname, '../cv.pdf');

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  // поля нулевые: внутренние отступы и цвет полей задаёт print-CSS страницы
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
});
await browser.close();
console.log('cv.pdf updated');
