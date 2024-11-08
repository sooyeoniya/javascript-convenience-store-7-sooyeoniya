
class ReceiptService {
  #stock;
  #promotion;
  #productManagementService;
  #receiptInfo;

  constructor(stock, promotion, productManagementService) {
    this.#stock = stock;
    this.#promotion = promotion;
    this.#productManagementService = productManagementService;
    this.#receiptInfo = [];
  }


}

export default ReceiptService;
