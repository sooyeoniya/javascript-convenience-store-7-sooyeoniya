
class ReceiptService {
  #stock;
  #promotion;
  #receiptInfo;

  constructor(stock, promotion) {
    this.#stock = stock;
    this.#promotion = promotion;
    this.#receiptInfo = [];
  }


}

export default ReceiptService;
