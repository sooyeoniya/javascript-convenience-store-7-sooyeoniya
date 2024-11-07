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

  }

  async #validateInputAsync() {
    try {
      const productsToPurchase = await InputView.readProductsInfoAsync();
      const parsedProductsToPurchase = parser.splitEachProduct(productsToPurchase);
      return validateProductsToPurchase(parsedProductsToPurchase, this.#stock);
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.#validateInputAsync();
    }
  }
}

export default Controller;
