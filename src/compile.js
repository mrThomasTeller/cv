import { marked } from 'marked';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';
import puppeteer from 'puppeteer';
import _ from 'lodash';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, 'template.html');
const readmePath = path.join(__dirname, '../README.md');
const outputPath = path.join(__dirname, '../index.html');
const pdfPath = path.join(__dirname, '../artem-backharev.pdf');

// Function to generate HTML file
const compileHTML = _.throttle(() => {
  // generate HTML from template and README
  const template = fs.readFileSync(templatePath, 'utf8');
  const content = marked.parse(fs.readFileSync(readmePath, 'utf-8'));
  const html = template.replace('{content}', content);
  fs.writeFileSync(outputPath, html);
  console.log('html updated');
}, 500);

const compilePDF = _.debounce(async () => {
  // use puppeteer to generate a pdf
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(`file://${outputPath}`, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: pdfPath,
    margin: {
      top: '20px',
      bottom: '20px',
      left: '20px',
      right: '20px',
    },
    format: 'A4',
  });
  await browser.close();
  console.log('pdf updated');
}, 1000);

function compile() {
  compileHTML();
  compilePDF();
}

// Generate HTML initially
compile();

// Watch for changes in template and README files
chokidar.watch([templatePath, readmePath]).on('change', compile);
