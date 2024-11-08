import parser from '../utils/parser.js';
import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import ConvenienceStoreService from '../service/ConvenienceStoreService.js';
import validateProductsToPurchase from '../validations/validateProductsToPurchase.js';
import validateConfirmationResponse from '../validations/validateConfirmationResponse.js';

class ConvenienceStoreController {
  #convenienceStoreService;

  constructor() {
    this.#convenienceStoreService = new ConvenienceStoreService();
    this.#convenienceStoreService.getUserConfirmation = this.getUserConfirmation.bind(this);
  }

  async start() {
    OutputView.printWelcomeGreeting();
    OutputView.printStockInfo(this.#convenienceStoreService.getStockInfo());

    const productsInfo = await this.#validateInputAsync();
    this.#convenienceStoreService.initProductsInfo(productsInfo);
    await this.#convenienceStoreService.processProductPromotions();
    await this.#convenienceStoreService.processGeneralProduct();
  }

  async getUserConfirmation(message) {
    try {
      const userInput = await InputView.readUserConfirmation(message);
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
      return validateProductsToPurchase(parsedProductsToPurchase, this.#convenienceStoreService);
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.#validateInputAsync();
    }
  }
}

export default ConvenienceStoreController;
