import { ERROR_MESSAGES, CONFIRMATION_RESPONSES } from '../constants/constants.js';

const validateConfirmationResponse = (userInput) => {
  if (![CONFIRMATION_RESPONSES.YES, CONFIRMATION_RESPONSES.NO].includes(userInput)) {
    throw new Error(ERROR_MESSAGES.OTHER_ERRORS);
  }

  return userInput;
}

export default validateConfirmationResponse;
