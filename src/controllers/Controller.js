import Stock from '../domains/Stock.js';
import Promotion from '../domains/Promotion.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import validateProductsDetails from '../validations/validateProductsDetails.js';
import ProductsManagementService from '../services/ProductsManagementService.js';
import getUserConfirm from '../utils/getUserConfirm.js';
import ReceiptService from '../services/ReceiptService.js';
import { PROMPT_MESSAGES, USER_ANSWER } from '../constants/constants.js';

class Controller {
  /** @type {Stock} */ #stock;
  /** @type {Promotion} */ #promotion;

  constructor() {
    this.#stock = new Stock();
    this.#promotion = new Promotion();
  }

  async start() {
    await this.#paymentSystem();

    const userConfirm = await getUserConfirm(PROMPT_MESSAGES.ADDITIONAL_PURCHASE);
    if (userConfirm === USER_ANSWER.YES) await this.start();
  }

  async #paymentSystem() {
    OutputView.printWelcomeGreeting();
    OutputView.printStockInfo(this.#stock.getStockInfo());

    const productManager = new ProductsManagementService(this.#stock, this.#promotion);
    const productsInfo = await this.#validateProductsDetailsAsync(productManager);

    await productManager.manageProducts(productsInfo);
    const receiptService = new ReceiptService(productManager.getProductsInfo(), this.#stock, this.#promotion);
    await receiptService.calculateReceipt();
    OutputView.printReceipt(receiptService.getReceiptInfo());
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
      return this.#validateProductsDetailsAsync(productManager);
    }
  }
}

export default Controller;
