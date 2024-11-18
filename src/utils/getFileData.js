import fs from 'fs';

const getFileData = (filePath) => {
  const fileInfo = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
  fileInfo.shift();

  return fileInfo;
}

export default getFileData;
