import getFileData from '../utils/getFileData.js';

class Stock {
  /** @type {Array<{ name: string, price: number, quantity: number, promotion: string | null }>}*/ #stockInfo = [];

  constructor() {
    this.#initStockInfo();
  }

  getStockInfo() {
    return this.#stockInfo;
  }

  /**
   * 해당 상품에 대한 프로모션 정보 반환
   * @param {string} productName 
   * @returns {string | null}
   */
  getPromotionName(productName) {
    return this.#stockInfo.find(({ name }) => name === productName).promotion;
  }

  /**
   * 해당 상품의 일반 재고 수량 반환
   * @param {string} productName 
   * @returns {number}
   */
  getGeneralStockQuantity(productName) {
    return this.#getGeneralStock(productName).quantity;
  }

  /**
   * 해당 상품의 프로모션 재고 수량 반환
   * @param {string} productName 
   * @returns {number}
   */
  getPromotionStockQuantity(productName) {
    return this.#getPromotionStock(productName).quantity;
  }

  /**
   * 프로모션 혜택 적용 상품: (프로모션 재고 + 일반 재고)에서 수량 초과되는지 확인
   * @param {string} productName 
   * @param {number} productQuantity 
   * @returns {boolean}
   */
  checkPromotionAndGeneralStockQuantity(productName, productQuantity) {
    const stockQuantity = this.getPromotionStockQuantity(productName) + this.getGeneralStockQuantity(productName);
    return stockQuantity < productQuantity;
  }

  /**
   * 프로모션 혜택 미적용 상품: 일반 재고에서 수량 초과되는지 확인
   * @param {string} productName 
   * @param {number} productQuantity 
   * @returns {boolean}
   */
  checkGeneralStockQuantity(productName, productQuantity) {
    const stockQuantity = this.getGeneralStockQuantity(productName);
    return stockQuantity < productQuantity;
  }

  /**
   * 존재하는 상품인지 확인
   * @param {string} productName 
   * @returns {boolean}
   */
  checkProductExists(productName) {
    return this.#stockInfo.some((product) => product.name === productName);
  }

  /**
   * 프로모션 미적용 상품에 대해 해당 상품 구매할 수량만큼 일반 재고 수량 차감
   * @param {string} productName 
   * @param {number} productQuantity 
   */
  deductGeneralStockQuantity(productName, productQuantity) {
    const generalStock = this.#getGeneralStock(productName);
    generalStock.quantity -= productQuantity;
  }

  /**
   * 프로모션 적용 상품에 대해 해당 상품 구매할 수량만큼 프로모션 재고 및 일반 재고에서 수량 차감
   * @param {string} productName 
   * @param {number} productQuantity 
   */
  deductPromotionAndGeneralStockQuantity(productName, productQuantity) {
    const promotionStock = this.#getPromotionStock(productName);
    const generalStock = this.#getGeneralStock(productName);
    if (productQuantity < promotionStock.quantity) {
      promotionStock.quantity -= productQuantity;
      return;
    }
    const diffPromotionStockQuantityAndProductQuantity = productQuantity - promotionStock.quantity;
    promotionStock.quantity = 0;
    generalStock.quantity -= diffPromotionStockQuantityAndProductQuantity;
  }

  /**
   * 해당 상품에 대한 일반 재고 정보 반환
   * @param {string} productName 
   * @returns {{ name: string, price: number, quantity: number, promotion: string | null }}
   */
  #getGeneralStock(productName) {
    return this.#stockInfo.find(({ name, promotion }) => name === productName && promotion === null);
  }

  /**
   * 해당 상품에 대한 프로모션 재고 정보 반환
   * @param {string} productName 
   * @returns {{ name: string, price: number, quantity: number, promotion: string | null }}
   */
  #getPromotionStock(productName) {
    return this.#stockInfo.find(({ name, promotion }) => name === productName && promotion !== null);
  }

  /**
   * 일반 재고 없는 상품에 대한 일반 재고 목록 추가
   */
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
    return this.#getPromotionStock(productName).price;
  }

  /**
   * 해당 상품에 대한 일반 재고 삽입
   * @param {string} name 
   * @param {number} price 
   * @param {number} promotionStockIndex 
   */
  #addGeneralStock(name, price, promotionStockIndex) {
    this.#stockInfo.splice(promotionStockIndex + 1, 0, { name, price, quantity: 0, promotion: null });
  }

  /**
   * 
   * @param {string} productInfo 
   * @returns {Array<{ name: string, price: number, quantity: number, promotion: string | null }>}
   */
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
