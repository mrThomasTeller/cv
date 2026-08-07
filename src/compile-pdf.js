import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const htmlPath = path.join(rootDir, 'index.html');

// Имя PDF берём из README: заголовок `#` без отчества + роль до разделителя `·`.
// Напр. «# Бахарев Артём Александрович» + «**Senior Frontend Engineer · React / TypeScript**»
// → «Бахарев Артём Senior Frontend Engineer.pdf»
function pdfNameFromReadme() {
  const readme = fs.readFileSync(path.join(rootDir, 'README.md'), 'utf8');

  const heading = readme.match(/^#\s+(.+)$/m);
  if (!heading) throw new Error('README.md: не найден заголовок `# Имя` — не из чего собрать имя PDF');
  const name = heading[1].trim().split(/\s+/).slice(0, 2).join(' ');

  // первая строка-подзаголовок вида **…** после заголовка (у строк-фактов `**…:** значение` есть текст после `**`)
  const role = readme
    .slice(heading.index + heading[0].length)
    .split('\n')
    .map((line) => line.trim().match(/^\*\*(.+)\*\*$/))
    .find(Boolean)?.[1]
    .split('·')[0]
    .trim();

  return `${[name, role].filter(Boolean).join(' ')}.pdf`.replace(/[\\/:*?"<>|]/g, '');
}

const pdfName = process.argv[2] || pdfNameFromReadme();
const pdfPath = path.join(rootDir, pdfName);

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
console.log(`${pdfName} updated`);

const stale = fs.readdirSync(rootDir).filter((file) => file.endsWith('.pdf') && file !== pdfName);
if (stale.length) console.log(`PDF со старым именем, их стоит удалить: ${stale.join(', ')}`);
