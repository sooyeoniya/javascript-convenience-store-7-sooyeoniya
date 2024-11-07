import fs from 'fs';

class Stock {
  #stockInfo = [];

  constructor() {
    this.#initStockInfo();
  }

  getStockInfo() {
    return this.#stockInfo;
  }

  checkProductExistence(productName) {
    return this.#stockInfo.some((product) => product.name === productName);
  }

  hasSufficientStock(productName, requestedQuantity, promotion) {
    const promotionInfo = promotion.getPromotionInfo();
    const productPromotion = this.#stockInfo.find((product) => product.name === productName).promotion;
    const totalQuantity = this.#calculateTotalQuantity(productName, promotionInfo, productPromotion);

    return totalQuantity >= requestedQuantity;
  }

  #calculateTotalQuantity(productName, promotionInfo, productPromotion) {
    let totalQuantity = 0;
    if (productPromotion && promotionInfo.some((promotion) => promotion.name === productPromotion && promotion.isAvailable)) {
      this.#stockInfo.forEach((product) => {
        if (product.name === productName) totalQuantity += product.quantity;
      });
      return totalQuantity;
    }
    this.#stockInfo.forEach((product) => {
      if (product.name === productName && product.promotion === null) totalQuantity += product.quantity;
    });
    return totalQuantity;
  }

  #readStockInfoFromFile() {
    const stockInfo = fs.readFileSync('public/products.md', 'utf-8').trim().split('\n');
    stockInfo.shift();

    return stockInfo;
  }

  #parseProductInfo(productInfo) {
    let [name, price, quantity, promotion] = productInfo.split(',');

    if (promotion === 'null') promotion = null;
    price = Number(price);
    quantity = Number(quantity);

    return { name, price, quantity, promotion };
  }

  #initStockInfo() {
    const stockInfo = this.#readStockInfoFromFile();

    stockInfo.forEach((productInfo) => {
      const product = this.#parseProductInfo(productInfo);
      if (product) this.#stockInfo.push(product);
    });
  }
}

export default Stock;
