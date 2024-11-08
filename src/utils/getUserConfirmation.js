import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import validateConfirmationResponse from '../validations/validateConfirmationResponse.js';

const getUserConfirmation = async (message) => {
  try {
    const userInput = await InputView.readUserConfirmationAsync(message);
    return validateConfirmationResponse(userInput);
  } catch (error) {
    OutputView.printErrorMessage(error.message);
    return await getUserConfirmation(message);
  }
}

export default getUserConfirmation;
