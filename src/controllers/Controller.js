import Stock from '../domains/Stock.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import validateProductsDetails from '../validations/validateProductsDetails.js';

class Controller {
  #stock;

  constructor() {
    this.#stock = new Stock();
  }

  async start() {
    OutputView.printWelcomeGreeting();
    OutputView.printStockInfo(this.#stock.getStockInfo());

    const productsInfo = await this.#validateProductsDetailsAsync();

  }

  async #validateProductsDetailsAsync() {
    try {
      const productsDetails = await InputView.readProductsDetailsAsync();
      return validateProductsDetails(productsDetails);
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.#validateProductsDetailsAsync();
    }
  }
}

export default Controller;
