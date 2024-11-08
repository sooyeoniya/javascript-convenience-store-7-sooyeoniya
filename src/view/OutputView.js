import { Console } from '@woowacourse/mission-utils';
import { PROMPT_MESSAGES } from '../constants/constants.js';

const OutputView = {
  printWelcomeGreetingAndStockInfo(stockInfo) {
    Console.print(PROMPT_MESSAGES.WELCOME_GREETING);
    stockInfo.forEach((productInfo) => this.printProductInfo(productInfo));
  },

  printProductInfo(productInfo) {
    let promotionText = productInfo.promotion;
    if (!productInfo.promotion) promotionText = '';

    let quentityText = '재고 없음';
    if (productInfo.quantity > 0) quentityText = `${productInfo.quantity}개`;

    const priceText = productInfo.price.toLocaleString('ko-KR');
    Console.print(`- ${productInfo.name} ${priceText}원 ${quentityText} ${promotionText}`);
  },

  printReceipt(receiptInfo) {
    Console.print('==============W 편의점================\n');
    Console.print('상품명             수량             금액');

    Console.print('=============증     정===============\n');

    Console.print('====================================\n');

  },

  printErrorMessage(errorMessage) {
    Console.print(errorMessage);
  },
}

export default OutputView;
