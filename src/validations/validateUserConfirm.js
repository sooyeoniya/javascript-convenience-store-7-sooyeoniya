import { ERROR_MESSAGES, USER_ANSWER } from '../constants/constants.js';
import parser from '../utils/parser.js';

const validateUserConfirm = (userConfirm) => {
  const parsedUserConfirm = parser.parseToUpperCase(userConfirm);
  if (![USER_ANSWER.YES, USER_ANSWER.NO].includes(parsedUserConfirm)) {
    throw new Error(ERROR_MESSAGES.OTHERS);
  }
  return parsedUserConfirm;
}

export default validateUserConfirm;
