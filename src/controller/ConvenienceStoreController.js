import Stock from '../domain/Stock.js';
import Promotion from '../domain/Promotion.js';
import parser from '../utils/parser.js';
import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import ReceiptService from '../service/ReceiptService.js';
import ConvenienceStoreService from '../service/ConvenienceStoreService.js';
import validateProductsToPurchase from '../validations/validateProductsToPurchase.js';
import validateConfirmationResponse from '../validations/validateConfirmationResponse.js';

class ConvenienceStoreController {
  #stock;
  #promotion;
  #convenienceStoreService;
  #receiptService;

  constructor() {
    this.#stock = new Stock();
    this.#promotion = new Promotion();
    this.#convenienceStoreService = new ConvenienceStoreService(this.#stock, this.#promotion);
    this.#convenienceStoreService.getUserConfirmation = this.getUserConfirmation.bind(this);
    this.#receiptService = new ReceiptService(this.#stock, this.#promotion);
  }

  async start() {
    OutputView.printWelcomeGreeting();
    OutputView.printStockInfo(this.#stock.getStockInfo());

    const productsInfo = await this.#validateInputAsync();
    this.#convenienceStoreService.initProductsInfo(productsInfo);
    await this.#convenienceStoreService.processProductPromotions();
    await this.#convenienceStoreService.processGeneralProduct();
    // TODO: 멤버십 할인 로직 추가
    // TODO: 영수증 내역 계산 및 출력 로직 추가
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
      return validateProductsToPurchase(parsedProductsToPurchase, this.#stock, this.#convenienceStoreService);
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.#validateInputAsync();
    }
  }
}

export default ConvenienceStoreController;
