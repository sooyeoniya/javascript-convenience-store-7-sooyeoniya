import getFileData from '../utils/getFileData.js';

class Stock {
  /** @type {Array<{ name: string, price: number, quantity: number, promotion: string | null }>}*/ #stockInfo = [];

  constructor() {
    this.#initStockInfo();
  }

  getStockInfo() {
    return this.#stockInfo;
  }

  #parseProductInfo(productInfo) {
    let [ name, price, quantity, promotion ] = productInfo.split(',');

    price = Number(price);
    quantity = Number(quantity);
    if (promotion === 'null') promotion = null;

    return { name, price, quantity, promotion };
  }

  #initStockInfo() {
    const stockInfo = getFileData('public/products.md');

    stockInfo.forEach((productInfo) => {
      const parsedProductInfo = this.#parseProductInfo(productInfo);
      if (parsedProductInfo) this.#stockInfo.push(parsedProductInfo);
    });
  }
}

export default Stock;
