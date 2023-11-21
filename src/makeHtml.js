import { marked } from 'marked';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, 'template.html');
const readmePath = path.join(__dirname, '../README.md');
const outputPath = path.join(__dirname, '../index.html');

// Function to generate HTML file
const generateHtml = () => {
  const template = fs.readFileSync(templatePath, 'utf8');
  const content = marked.parse(fs.readFileSync(readmePath, 'utf-8'));
  const html = template.replace('{content}', content);
  fs.writeFileSync(outputPath, html);
  console.log('index.html updated');
};

// Generate HTML initially
generateHtml();

// Watch for changes in template and README files
chokidar.watch([templatePath, readmePath]).on('change', () => {
  generateHtml();
});
