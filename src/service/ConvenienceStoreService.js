class ConvenienceStoreService {
  #stock;
  #promotion;

  constructor(stock, promotion) {
    this.#stock = stock;
    this.#promotion = promotion;
  }

  checkProductExistence(productName) {
    return this.#stock.getStockInfo().some((product) => product.name === productName);
  }

  hasSufficientStock(productName, requestedQuantity) {
    const promotionInfo = this.#promotion.getPromotionInfo();
    const productPromotion = this.#stock.getStockInfo().find((product) => product.name === productName).promotion;
    const totalQuantity = this.#calculateTotalQuantity(productName, promotionInfo, productPromotion);

    return totalQuantity >= requestedQuantity;
  }

  #calculateTotalQuantity(productName, promotionInfo, productPromotion) {
    let totalQuantity = 0;
    if (productPromotion && promotionInfo.some((promotion) => promotion.name === productPromotion && promotion.isAvailable)) {
      this.#stock.getStockInfo().forEach((product) => {
        if (product.name === productName) totalQuantity += product.quantity;
      });
      return totalQuantity;
    }
    this.#stock.getStockInfo().forEach((product) => {
      if (product.name === productName && product.promotion === null) totalQuantity += product.quantity;
    });
    return totalQuantity;
  }
}

export default ConvenienceStoreService;
