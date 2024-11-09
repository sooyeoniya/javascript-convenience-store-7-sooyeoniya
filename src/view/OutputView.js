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

  // TODO: 함수 길이 10으로 줄이기
  printReceipt(receiptInfo) {
    Console.print('\n==============W 편의점================');
    Console.print('상품명\t\t수량\t\t금액\n');

    receiptInfo.items.forEach((item) => {
      let name = item.name;
      if (item.name.length < 4) name = `${item.name}\t`;
      Console.print(`${name}\t${item.quantity}\t\t${item.itemTotalAmount.toLocaleString('ko-KR')}`);
    });

    Console.print('\n==============증     정===============\n');
    receiptInfo.items
      .filter((item) => item.giftCount > 0)
      .forEach((item) => {
        let name = item.name;
        if (item.name.length < 4) name = `${item.name}\t`;
        Console.print(`${name}\t${item.giftCount}`);
      });

    Console.print('\n======================================\n');
    Console.print(`총구매액\t${receiptInfo.totalQuantity}\t\t${receiptInfo.totalAmount.toLocaleString('ko-KR')}`);
    Console.print(`행사할인\t\t\t-${receiptInfo.eventDiscount.toLocaleString('ko-KR')}`);
    Console.print(`멤버십할인\t\t\t-${receiptInfo.membershipDiscount.toLocaleString('ko-KR')}`);
    Console.print(`내실돈\t\t\t\t${receiptInfo.finalAmount.toLocaleString('ko-KR')}`);
  },

  printErrorMessage(errorMessage) {
    Console.print(errorMessage);
  },
}

export default OutputView;
