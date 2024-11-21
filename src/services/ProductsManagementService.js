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
   * [사용자가 구매할 상품에 대한 관리 서비스]
   * 1) 프로모션 적용 가능 상품인 경우
   *  - 프로모션 재고 수량보다 적은 경우: 프로모션 혜택 증정 수량 추가 가능한 경우 안내 메시지 출력
   *  - 프로모션 재고 수량과 같거나 많은 경우: 재고 부족에 대한 일부 수량 정가 결제 안내 메시지 출력
   *  - 프로모션 재고 우선 차감, 프로모션 재고 없는 경우 일반 재고 차감
   * 2) 프로모션 미적용 상품인 경우
   *  - 일반 재고 차감
   * @param {Array<{ name: string, quantity: number }>} productInfo 
   */
  manageProducts(productInfo) {
    productInfo.forEach(({ name, quantity }) => {
      const isPromotionPeriod = this.#checkPromotionPeriodProduct(name);
      if (isPromotionPeriod) {
        this.#checkAndMessageStockQuantity(name, quantity);
        this.#stock.deductPromotionAndGeneralStockQuantity(name, quantity);
        return;
      }
      this.#stock.deductGeneralStockQuantity(name, quantity);
    });
  }

  /**
   * 프로모션 재고 수량보다 적은지 혹은 같거나 많은지 확인하여 안내 메시지 분기 처리
   * @param {string} productName 
   * @param {number} productQuantity 
   */
  #checkAndMessageStockQuantity(productName, productQuantity) {
    const promotionQuantity = this.#stock.getPromotionStockQuantity(productName);
    if (productQuantity < promotionQuantity) {
      this.#messageAdditionalQuantity(productName, productQuantity);
      return;
    }
    this.#messageFullPricePaymentForSomeQuantities(productName, productQuantity);
  }

  /**
   * 프로모션 혜택 증정 수량 추가 가능한 경우 안내 메시지 출력
   * - 해당 프로모션에 대해 혜택 받을 수량 추가 가능한 경우 안내
   *  - Y: 프로모션 혜택 증정 수량 추가 / N: 해당 수량에 대해 프로모션 혜택 적용 안함
   * @param {string} productName 
   * @param {number} productQuantity 
   */
  #messageAdditionalQuantity(productName, productQuantity) {
    
  }

  /**
   * 재고 부족에 대한 일부 수량 정가 결제 안내 메시지 출력
   * - 정가로 결제해야 하는 일부 수량에 대한 안내
   *  - Y: 일부 수량 정가 결제 / N: 일부 수량 결제 취소
   * @param {string} productName 
   * @param {number} productQuantity 
   */
  #messageFullPricePaymentForSomeQuantities(productName, productQuantity) {
    
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
