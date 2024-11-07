import Stock from '../domain/Stock.js';
import Promotion from '../domain/Promotion.js';
import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import parser from '../utils/parser.js';
import validateProductsToPurchase from '../validations/validateProductsToPurchase.js';

class Controller {
  #stock;
  #promotion;

  constructor() {
    this.#stock = new Stock();
    this.#promotion = new Promotion();
  }

  async start() {
    OutputView.printWelcomeGreeting();
    OutputView.printStockInfo(this.#stock.getStockInfo());

    const productsInfo = await this.#validateInputAsync();


    // 프로모션 적용 가능한지 아닌지 확인
    // true 인 경우 프로모션 먼저 재고 차감 -> 부족한 경우 일반 재고 차감
    // false 인 경우 일반 재고에서 차감

    // 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량만큼 가져오지 않았을 경우, 혜택에 대한 안내 메시지를 출력한다.
    // 현재 {상품명}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)


  }

  async #validateInputAsync() {
    try {
      const productsToPurchase = await InputView.readProductsInfoAsync();
      const parsedProductsToPurchase = parser.splitEachProduct(productsToPurchase);
      return validateProductsToPurchase(parsedProductsToPurchase, this.#stock, this.#promotion);
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.#validateInputAsync();
    }
  }
}

export default Controller;
