import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

function countLinesInFile(filePath: string): number {
  const content = readFileSync(filePath, 'utf-8');
  // Разбиваем по \n, но исключаем \n внутри строковых литералов
  const lines = content.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed.length > 0 && !trimmed.startsWith('//'); // Игнорируем пустые строки и комментарии
  });
  return lines.length;
}

function countLinesInDir(dir: string): number {
  let totalLines = 0;
  const files = readdirSync(dir);

  for (const file of files) {
    const fullPath = join(dir, file);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      totalLines += countLinesInDir(fullPath);
    } else if (stats.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      totalLines += countLinesInFile(fullPath);
    }
  }
  return totalLines;
}

const srcDir = join(process.cwd(), 'src');
const totalLines = countLinesInDir(srcDir);
console.log(`Total lines of code: ${totalLines}`);