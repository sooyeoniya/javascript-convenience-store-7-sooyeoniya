import { ERROR_MESSAGES } from '../constants/constants.js';

const validateConfirmationResponse = (userInput) => {
  if (!['Y', 'y', 'N', 'n'].includes(userInput)) {
    throw new Error(ERROR_MESSAGES.USER_CONFIRM);
  }

  return userInput;
}

export default validateConfirmationResponse;
