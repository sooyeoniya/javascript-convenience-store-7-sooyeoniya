import Stock from '../domain/Stock.js';
import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';

class Controller {
  async start() {
    OutputView.printWelcomeGreeting();

    const stock = new Stock();
    OutputView.printStockInfo(stock.getStockInfo());

    await InputView.readProductsInfoAsync();

  }
}

export default Controller;
