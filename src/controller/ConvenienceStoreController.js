import parser from '../utils/parser.js';
import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import ConvenienceStoreService from '../service/ConvenienceStoreService.js';
import validateProductsToPurchase from '../validations/validateProductsToPurchase.js';

class ConvenienceStoreController {
  #convenienceStoreService;

  constructor() {
    this.#convenienceStoreService = new ConvenienceStoreService();
  }

  async start() {
    OutputView.printWelcomeGreeting();
    OutputView.printStockInfo(this.#convenienceStoreService.getStockInfo());

    const productsInfo = await this.#validateInputAsync();
    this.#convenienceStoreService.initProductsInfo(productsInfo);
    this.#convenienceStoreService.processProductPromotions();
    this.#convenienceStoreService.processGeneralProduct();
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
