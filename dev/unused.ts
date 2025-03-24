import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

function findExports(dir: string): Map<string, string> {
  const exports = new Map<string, string>();
  const items = readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      // Рекурсивно обрабатываем поддиректории
      const subExports = findExports(fullPath);
      subExports.forEach((value, key) => exports.set(key, value));
    } else if (item.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      const content = readFileSync(fullPath, 'utf-8');
      const matches = content.matchAll(/(?:export\s+default\s+|export\s+(?:function|const)\s+)(\w+)/g);
      for (const match of matches) {
        exports.set(match[1], fullPath);
      }
    }
  }
  return exports;
}

function findImports(dir: string, component: string): boolean {
  const items = readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      if (findImports(fullPath, component)) return true;
    } else if (item.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      const content = readFileSync(fullPath, 'utf-8');
      if (content.includes(`import ${component}`) || content.includes(`import { ${component} }`)) {
        return true;
      }
    }
  }
  return false;
}

// Путь к src относительно текущей директории (dev)
const srcDir = join(process.cwd(), 'src');
const exportsMap = findExports(srcDir);
const unused = new Map<string, string>();

for (const [name, path] of exportsMap) {
  if (!findImports(srcDir, name)) {
    unused.set(name, path);
  }
}

// Стилизованный вывод
console.log(chalk.blue.bold('Unused components:'));
unused.forEach((path, name) => {
  console.log(`${chalk.green(name)} in ${chalk.red(path)}`);
});