import { Console } from '@woowacourse/mission-utils';
import { PROMPT_MESSAGES } from '../constants/constants.js';

const readInput = (inputMessage) => {
  try {
    return Console.readLineAsync(inputMessage);
  } catch (error) {
    Console.print(error.message);
  }
};

const InputView = {
  async readProductsInfoAsync() {
    return await readInput(PROMPT_MESSAGES.PRODUCTS_INFO);
  },

  async readUserConfirmationAsync(message) {
    return await readInput(message);
  },
}

export default InputView;
