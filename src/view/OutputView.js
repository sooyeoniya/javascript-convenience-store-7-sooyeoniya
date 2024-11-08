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
    Console.print('상품명             수량           금액');

    receiptInfo.items.forEach((item) => {
      Console.print(`${item.name}             ${item.quantity}           ${item.itemTotalAmount.toLocaleString('ko-KR')}`);
    });

    Console.print('==============증     정===============\n');
    receiptInfo.items
      .filter((item) => item.giftCount > 0)
      .forEach((item) => {
        Console.print(`${item.name}             ${item.giftCount}`);
      });

    Console.print('======================================\n');
    Console.print(`총구매액             ${receiptInfo.totalQuantity}          ${receiptInfo.totalAmount.toLocaleString('ko-KR')}`);
    Console.print(`행사할인                            -${receiptInfo.eventDiscount.toLocaleString('ko-KR')}`);
    Console.print(`멤버십할인                          -${receiptInfo.membershipDiscount.toLocaleString('ko-KR')}`);
    Console.print(`내실돈                              ${receiptInfo.finalAmount.toLocaleString('ko-KR')}`);
  },

  printErrorMessage(errorMessage) {
    Console.print(errorMessage);
  },
}

export default OutputView;
