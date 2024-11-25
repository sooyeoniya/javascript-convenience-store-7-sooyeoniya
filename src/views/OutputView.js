import { Console } from '@woowacourse/mission-utils';
import parser from '../utils/parser.js';

const OutputView = {
  printWelcomeGreeting() {
    Console.print('\n안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n');
  },
  
  /**
   * 
   * @param {Array<{ name: string, price: number, quantity: number, promotion: string | null }>} stockInfo 
   */
  printStockInfo(stockInfo) {
    stockInfo.forEach((productInfo) => {
      const price = parser.parseThousandComma(productInfo.price);
      
      let quantity = `${productInfo.quantity}개`;
      if (productInfo.quantity === 0) quantity = '재고 없음';

      let promotion = productInfo.promotion;
      if (productInfo.promotion === null) promotion = '';

      Console.print(`- ${productInfo.name} ${price}원 ${quantity} ${promotion}`);
    });
  },

  printErrorMessage(errorMessage) {
    Console.print(errorMessage);
  },

  printReceipt(receiptInfo) {
    Console.print('\n===========W\t편의점=============');
    Console.print('상품명\t\t수량\t\t금액');
    receiptInfo.productsInfo.forEach((product) => {
      Console.print(`${product.name}\t\t${product.quantity}\t\t${product.totalPrice}`);
    });
    Console.print('===========증\t정=============');
    receiptInfo.productsInfo.forEach((product) => {
      Console.print(`${product.name}\t\t${product.giftQuantity}`);
    });
    Console.print('==============================');
    Console.print(`총구매액\t${receiptInfo.totalQuantity}\t${receiptInfo.totalProductsAmount}`);
    Console.print(`행사할인\t-${receiptInfo.promotionDiscount}`);
    Console.print(`멤버십할인\t-${receiptInfo.membershipDiscount}`);
    Console.print(`내실돈\t${receiptInfo.totalPaymentAmount}`);
  },
}

export default OutputView;
