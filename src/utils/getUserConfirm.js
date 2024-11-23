import OutputView from '../views/OutputView.js';
import InputView from '../views/InputView.js';
import validateUserConfirm from '../validations/validateUserConfirm.js';

const getUserConfirm = async (promptMessage) => {
  try {
    const userConfirm = await InputView.readUserConfirm(promptMessage);
    return validateUserConfirm(userConfirm);
  } catch (error) {
    OutputView.printErrorMessage(error.message);
    return getUserConfirm(promptMessage);
  }
}

export default getUserConfirm;
