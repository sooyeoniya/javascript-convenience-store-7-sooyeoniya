import Stock from '../domain/Stock.js';
import Promotion from '../domain/Promotion.js';
import parser from '../utils/parser.js';
import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import ReceiptService from '../service/ReceiptService.js';
import ProductManagementService from '../service/ProductManagementService.js';
import validateProductsToPurchase from '../validations/validateProductsToPurchase.js';
import getUserConfirmation from '../utils/getUserConfirmation.js';
import { INPUT_MESSAGES } from '../constants/constants.js';

class ConvenienceStoreController {
  #stock;
  #promotion;

  constructor() {
    this.#stock = new Stock();
    this.#promotion = new Promotion();
  }

  async start() {
    await this.processPurchase();

    let additionalPurchase = await getUserConfirmation(INPUT_MESSAGES.ADDITIONAL_PURCHASE);
    while (additionalPurchase.toUpperCase() === 'Y') {
      await this.processPurchase();
      additionalPurchase = await getUserConfirmation(INPUT_MESSAGES.ADDITIONAL_PURCHASE);
    }
  }

  async processPurchase() {
    OutputView.printWelcomeGreetingAndStockInfo(this.#stock.getStockInfo());

    const productManagementService = new ProductManagementService(this.#stock, this.#promotion);
    const receiptService = new ReceiptService(this.#stock, this.#promotion, productManagementService);

    const productsInfo = await this.#validateInputAsync(productManagementService);
    await productManagementService.processProducts(productsInfo);
    
    const receiptInfo = await receiptService.processReceipt();
    OutputView.printReceipt(receiptInfo);
  }

  async #validateInputAsync(productManagementService) {
    try {
      const productsToPurchase = await InputView.readProductsInfoAsync();
      const parsedProductsToPurchase = parser.splitEachProduct(productsToPurchase);
      return validateProductsToPurchase(parsedProductsToPurchase, this.#stock, productManagementService);
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.#validateInputAsync(productManagementService);
    }
  }
}

export default ConvenienceStoreController;
