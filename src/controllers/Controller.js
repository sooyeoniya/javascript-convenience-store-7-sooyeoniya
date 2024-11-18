import Stock from '../domains/Stock.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';

class Controller {
  #stock;

  constructor() {
    this.#stock = new Stock();
  }

  async start() {
    OutputView.printWelcomeGreeting();
    OutputView.printStockInfo(this.#stock.getStockInfo());
    const productsDetails = await InputView.readProductsDetailsAsync();
    
  }
}

export default Controller;
