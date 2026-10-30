// Brings the docs, the changelog and the screenshots from the extension repository, so each lives in one place.
// The extension repository is the folder next to this one, or the one `EXTENSION_PATH` names (the workflow checks it out).
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const extension = resolve(site, process.env.EXTENSION_PATH ?? '../git-checkout');
const docs = join(site, 'src/content/docs');

const readme = readFileSync(join(extension, 'README.md'), 'utf8');
const sections = Object.fromEntries(
  readme
    .split(/\n(?=## )/)
    .slice(1)
    .map((part) => [part.split('\n', 1)[0].slice(3).trim(), part.slice(part.indexOf('\n') + 1).trim()]),
);

const page = (slug, title, description, order, body) => {
  mkdirSync(join(docs, 'docs'), { recursive: true });
  writeFileSync(join(docs, 'docs', `${slug}.md`), `---\ntitle: ${title}\ndescription: ${description}\nsidebar:\n  order: ${order}\n---\n\n${body.trim()}\n`);
};

page('getting-started', 'Getting started', 'Install Git Checkout and open your first repository.', 1, [
  'Git Checkout runs on the **workspace** side, so Git always runs on the same machine as your folder: local, WSL, SSH, Dev Containers or Codespaces.',
  `## Requirements\n\n${sections.Requirements}`,
  '## Install\n\nInstall **Git Checkout** (`rkonit.gitcheckout`) from the VS Code Marketplace, or run `ext install rkonit.gitcheckout` in the Quick Open box.',
  `## First steps\n\n${sections['Getting started']}`,
].join('\n\n'));
page('features', 'Features', 'What Git Checkout does, from the commit graph to merge conflicts.', 2, sections.Features);
page('settings', 'Settings', 'Every Git Checkout setting and what it does.', 3, sections.Settings);
page('shortcuts', 'Keyboard shortcuts', 'The shortcuts that work in Git Checkout views, and how to change them.', 4, sections['Keyboard shortcuts']);
page('extending', 'Extending', 'Custom commands, external diff and merge tools, and .gitignore helpers.', 5, sections.Extending);
page('remote', 'Remote workspaces', 'Using Git Checkout over WSL, SSH, Dev Containers and Codespaces.', 6, sections['Remote workspaces'].replace('### Git path', '## Git path'));
page('privacy', 'Privacy', 'What Git Checkout sends over the network, which is almost nothing.', 7, sections.Privacy);

const changelog = readFileSync(join(extension, 'CHANGELOG.md'), 'utf8').replace(/^# Changelog\s*/, '');
writeFileSync(
  join(docs, 'changelog.md'),
  `---\ntitle: Changelog\ndescription: What changed in each release of Git Checkout.\nsidebar:\n  order: 99\n---\n\n${changelog.trim()}\n`,
);

const shots = join(site, 'src/assets/screenshots');
rmSync(shots, { recursive: true, force: true });
cpSync(join(extension, 'docs/screenshots'), shots, { recursive: true });
cpSync(join(extension, 'resources/git-checkout.svg'), join(site, 'public/favicon.svg'));

console.log(`Synced from ${extension}: ${readdirSync(join(docs, 'docs')).length} docs, the changelog and ${readdirSync(shots).length} screenshots.`);
