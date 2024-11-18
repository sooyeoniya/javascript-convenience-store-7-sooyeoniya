import getFileData from '../utils/getFileData.js';

class Stock {
  /** @type {Array<{ name: string, price: number, quantity: number, promotion: string | null }>}*/ #stockInfo = [];

  constructor() {
    this.#initStockInfo();
  }

  getStockInfo() {
    return this.#stockInfo;
  }

  #checkAndAddGeneralStock() {
    const productNames = Array.from(new Set(this.#stockInfo.map(({ name }) => name )));
    productNames.forEach((productName) => {
      const checkGeneralStock = (productInfo) => productInfo.name === productName && productInfo.promotion === null;
      const hasGeneralStock = this.#stockInfo.some((productInfo) => checkGeneralStock(productInfo));
      if (hasGeneralStock) return;

      const promotionStockIndex = this.#getPromotionStockIndex(productName);
      const productPrice = this.#getProductPrice(productName);
      this.#addGeneralStock(productName, productPrice, promotionStockIndex);
    });
  }

  /**
   * 해당 상품의 프로모션 재고 인덱스 위치를 반환한다.
   * @param {string} productName 
   * @returns {number}
   */
  #getPromotionStockIndex(productName) {
    return this.#stockInfo
      .map((product, index) => ({ product, index })) // () => () 객체 리터럴 묶기
      .filter(({ product }) => product.name === productName && product.promotion !== null)
      .slice(-1)[0].index;
  }

  /**
   * 해당 상품의 가격을 반환한다.
   * @param {string} productName 
   * @returns {number}
   */
  #getProductPrice(productName) {
    return this.#stockInfo.find(({ name, promotion }) => name === productName && promotion !== null).price;
  }

  #addGeneralStock(name, price, promotionStockIndex) {
    this.#stockInfo.splice(promotionStockIndex + 1, 0, { name, price, quantity: 0, promotion: null });
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
    this.#checkAndAddGeneralStock();
  }
}

export default Stock;
