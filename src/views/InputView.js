import { Console } from '@woowacourse/mission-utils';
import { PROMPT_MESSAGES } from '../constants/constants.js';

const readPipe = (promptMessage = '') => {
  try {
    return Console.readLineAsync(promptMessage);
  } catch (error) {
    throw new Error(error.message);
  }
}

const InputView = {
  async readProductsDetailsAsync() {
    return await readPipe(PROMPT_MESSAGES.PRODUCTS_DETAILS);
  },

  async readUserConfirm(promptMessage) {
    return await readPipe(promptMessage);
  },
}

export default InputView;
