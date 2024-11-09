import { ERROR_MESSAGES, CONFIRMATION_RESPONSES } from '../constants/constants.js';

const validateConfirmationResponse = (userInput) => {
  if (![CONFIRMATION_RESPONSES.YES, CONFIRMATION_RESPONSES.NO].includes(userInput.toUpperCase())) {
    throw new Error(ERROR_MESSAGES.USER_CONFIRM);
  }

  return userInput.toUpperCase();
}

export default validateConfirmationResponse;
