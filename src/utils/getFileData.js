import fs from 'fs';
import { SPLIT } from '../constants/constants.js';

const getFileData = (filePath) => {
  const fileInfo = fs.readFileSync(filePath, 'utf-8').trim().split(SPLIT.NEWLINE);
  fileInfo.shift();

  return fileInfo;
}

export default getFileData;
