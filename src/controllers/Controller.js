import Stock from '../domains/Stock.js';
import Promotion from '../domains/Promotion.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import validateProductsDetails from '../validations/validateProductsDetails.js';
import ProductsManagementService from '../services/ProductsManagementService.js';

class Controller {
  /** @type {Stock} */ #stock;
  /** @type {Promotion} */ #promotion;

  constructor() {
    this.#stock = new Stock();
    this.#promotion = new Promotion();
  }

  async start() {
    OutputView.printWelcomeGreeting();
    OutputView.printStockInfo(this.#stock.getStockInfo());

    const productManager = new ProductsManagementService(this.#stock, this.#promotion);
    const productsInfo = await this.#validateProductsDetailsAsync(productManager);

    productManager.manageProducts(productsInfo);
  }

  /**
   * 
   * @param {ProductsManagementService} productManager 
   * @returns {Array<{ name: string, quantity: number }>}
   */
  async #validateProductsDetailsAsync(productManager) {
    try {
      const productsDetails = await InputView.readProductsDetailsAsync();
      return validateProductsDetails(productsDetails, this.#stock, productManager);
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return await this.#validateProductsDetailsAsync(productManager);
    }
  }
}

export default Controller;
