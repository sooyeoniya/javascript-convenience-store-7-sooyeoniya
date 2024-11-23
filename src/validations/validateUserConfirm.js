import parser from '../utils/parser.js';

const validateUserConfirm = (userConfirm) => {
  const parsedUserConfirm = parser.parseToUpperCase(userConfirm);
  if (!['Y', 'N'].includes(parsedUserConfirm)) {
    throw new Error('[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.');
  }
  return parsedUserConfirm;
}

export default validateUserConfirm;
