import fs from 'fs';

const readFileData = (filePath) => {
  const stockInfo = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
  stockInfo.shift();

  return stockInfo;
}

export default readFileData;
