import { Console } from '@woowacourse/mission-utils';
import parser from '../utils/parser.js';
import { PROMPT_MESSAGES, ZERO, NO_STOCK } from '../constants/constants.js';

const OutputView = {
  printWelcomeGreeting() {
    Console.print(PROMPT_MESSAGES.WELCOME_GREETING);
  },

  /**
   * 
   * @param {Array<{ name: string, price: number, quantity: number, promotion: string | null }>} stockInfo 
   */
  printStockInfo(stockInfo) {
    stockInfo.forEach((productInfo) => {
      const price = parser.parseThousandComma(productInfo.price);
      
      let quantity = `${productInfo.quantity}개`;
      if (productInfo.quantity === ZERO) quantity = NO_STOCK;

      let promotion = productInfo.promotion;
      if (productInfo.promotion === null) promotion = '';

      Console.print(`- ${productInfo.name} ${price}원 ${quantity} ${promotion}`);
    });
  },

  printErrorMessage(errorMessage) {
    Console.print(errorMessage);
  },

  printReceipt(receiptInfo) {
    Console.print('\n==============W 편의점===============');
    Console.print('상품명\t\t수량\t\t금액');
    receiptInfo.productsInfo.forEach((product) => {
      Console.print(`${parser.adjustTabsByLetterLength(product.name)}${product.quantity}\t\t${parser.parseThousandComma(product.totalPrice)}`);
    });

    Console.print('===============증 정=================');
    receiptInfo.productsInfo
    .filter((product) => product.giftQuantity > ZERO)
    .forEach((product) => {
      Console.print(`${parser.adjustTabsByLetterLength(product.name)}${product.giftQuantity}`);
    });

    Console.print('=====================================');
    Console.print(`총구매액\t${receiptInfo.totalQuantity}\t\t${parser.parseThousandComma(receiptInfo.totalProductsAmount)}`);
    Console.print(`행사할인\t\t\t-${parser.parseThousandComma(receiptInfo.promotionDiscount)}`);
    Console.print(`멤버십할인\t\t\t-${parser.parseThousandComma(receiptInfo.membershipDiscount)}`);
    Console.print(`내실돈\t\t\t\t${parser.parseThousandComma(receiptInfo.totalPaymentAmount)}`);
  },
}

export default OutputView;
