import { Console } from '@woowacourse/mission-utils';

const readPipe = (promptMessage = '') => {
  try {
    return Console.readLineAsync(promptMessage);
  } catch (error) {
    throw new Error(error.message);
  }
}

const InputView = {
  async readProductsDetailsAsync() {
    return await readPipe('\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n');
  },

  async readUserConfirm(promptMessage) {
    return await readPipe(promptMessage);
  },
}

export default InputView;
