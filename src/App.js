import ConvenienceStoreController from './controller/ConvenienceStoreController.js';

class App {
  async run() {
    await new ConvenienceStoreController().start();
  }
}

export default App;
