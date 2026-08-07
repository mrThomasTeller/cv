# CV

Репозиторий резюме. Источник данных — `README.md` в корне (markdown-версия резюме).

## Сборка

- `/cv-transform-readme` — собрать `index.html` из `README.md` по шаблону `src/template.html` и сразу перегнать в PDF.
- `npm run compile-pdf` — только `index.html` → PDF (`src/compile-pdf.js`, puppeteer).
- Имя PDF выводится из README: заголовок `#` без отчества + роль до `·`, напр. `Бахарев Артём Senior Frontend Engineer.pdf`.

## Правила

- Контент правится в `README.md`, дизайн — в `src/template.html`; `index.html` и PDF — генерируемые артефакты, руками их не редактировать.
- После любых правок README или шаблона пересобирай резюме через `/cv-transform-readme`.
- Правила подстановки данных в шаблон — в `.agents/skills/cv-transform-readme/SKILL.md`.
