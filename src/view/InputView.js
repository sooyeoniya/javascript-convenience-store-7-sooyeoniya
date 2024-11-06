import { Console } from '@woowacourse/mission-utils';
import { INPUT_MESSAGES } from '../constants/constants.js';

const readInput = (inputMessage) => {
  try {
    return Console.readLineAsync(inputMessage);
  } catch (error) {
    Console.print(error.message);
  }
};

const InputView = {
  async readProductsInfoAsync() {
    return await readInput(INPUT_MESSAGES.PRODUCTS_INFO);
  },

}

export default InputView;
