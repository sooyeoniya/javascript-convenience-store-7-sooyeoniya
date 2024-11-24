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
  }
}

export default OutputView;
