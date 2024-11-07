import fs from 'fs';

class Stock {
  #stockInfo = [];

  constructor() {
    this.#initStockInfo();
  }

  getStockInfo() {
    return this.#stockInfo;
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
