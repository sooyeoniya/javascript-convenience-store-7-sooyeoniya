import Stock from '../domains/Stock.js';
import Promotion from '../domains/Promotion.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import validateProductsDetails from '../validations/validateProductsDetails.js';
import ProductsManagementService from '../services/ProductsManagementService.js';

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

    const productsInfo = await this.#validateProductsDetailsAsync();
    const productManager = new ProductsManagementService(this.#stock);

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
