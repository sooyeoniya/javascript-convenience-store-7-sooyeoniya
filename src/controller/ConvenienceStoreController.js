import Stock from '../domain/Stock.js';
import Promotion from '../domain/Promotion.js';
import parser from '../utils/parser.js';
import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import ReceiptService from '../service/ReceiptService.js';
import ProductManagementService from '../service/ProductManagementService.js';
import validateProductsToPurchase from '../validations/validateProductsToPurchase.js';
import validateConfirmationResponse from '../validations/validateConfirmationResponse.js';

class ConvenienceStoreController {
  #stock;
  #promotion;
  #productManagementService;
  #receiptService;

  constructor() {
    this.#stock = new Stock();
    this.#promotion = new Promotion();
    this.#productManagementService = new ProductManagementService(this.#stock, this.#promotion);
    this.#productManagementService.getUserConfirmation = this.getUserConfirmation.bind(this);
    this.#receiptService = new ReceiptService(this.#stock, this.#promotion, this.#productManagementService);
    this.#receiptService.getUserConfirmation = this.getUserConfirmation.bind(this);
  }

  async start() {
    OutputView.printWelcomeGreeting();
    OutputView.printStockInfo(this.#stock.getStockInfo());

    const productsInfo = await this.#validateInputAsync();
    this.#productManagementService.initProductsInfo(productsInfo);
    await this.#productManagementService.processProducts();
    
    const receiptInfo = await this.#receiptService.processReceipt();
    OutputView.printReceipt(receiptInfo);
    // TODO: 추가 구매 로직 추가
  }

  async getUserConfirmation(message) {
    try {
      const userInput = await InputView.readUserConfirmationAsync(message);
      return validateConfirmationResponse(userInput);
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return await this.getUserConfirmation(message);
    }
  }

  async #validateInputAsync() {
    try {
      const productsToPurchase = await InputView.readProductsInfoAsync();
      const parsedProductsToPurchase = parser.splitEachProduct(productsToPurchase);
      return validateProductsToPurchase(parsedProductsToPurchase, this.#stock, this.#productManagementService);
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.#validateInputAsync();
    }
  }
}

export default ConvenienceStoreController;
