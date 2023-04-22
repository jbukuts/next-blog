import fs from 'fs';

export default JSON.parse(
  fs.readFileSync('./public/code-themes/vscode.json', 'utf-8')
);
