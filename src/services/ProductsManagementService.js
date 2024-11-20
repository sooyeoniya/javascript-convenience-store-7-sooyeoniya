import Stock from '../domains/Stock.js';
import Promotion from '../domains/Promotion.js';

class ProductsManagementService {
  /** @type {Stock} */ #stock;
  /** @type {Promotion} */ #promotion;

  constructor(stock, promotion) {
    this.#stock = stock;
    this.#promotion = promotion;
  }

  /**
   * 해당 상품에 대한 수량을 초과하는지 초과하지 않는지 반환한다.
   * @param {string} productName 
   * @param {number} productQuantity 
   * @returns {boolean}
   */
  checkExcessQuantity(productName, productQuantity) {
    const isPromotionPeriod = this.#checkPromotionPeriodProduct(productName);
    if (isPromotionPeriod) return this.#stock.checkPromotionAndGeneralStockQuantity(productName, productQuantity);
    return this.#stock.checkGeneralStockQuantity(productName, productQuantity);
  }

  /**
   * 해당 상품이 프로모션 기간인지 확인
   * @param {string} productName 
   * @returns {boolean}
   */
  #checkPromotionPeriodProduct(productName) {
    const promotionName = this.#stock.getPromotionName(productName);
    return this.#promotion.hasPromotion(promotionName);
  }
}

export default ProductsManagementService;
