import Stock from '../domains/Stock.js';
import Promotion from '../domains/Promotion.js';
import getUserConfirm from '../utils/getUserConfirm.js';

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
   * @param {Array<{ name: string, quantity: number }>} productsInfo 
   */
  async manageProducts(productsInfo) {
    for (const { name, quantity } of productsInfo) {
      const isPromotionPeriod = this.#checkPromotionPeriodProduct(name);
      if (isPromotionPeriod) {
        await this.#checkAndMessageStockQuantity(name, quantity);
        this.#stock.deductPromotionAndGeneralStockQuantity(name, quantity);
        return;
      }
      this.#stock.deductGeneralStockQuantity(name, quantity);
    }
  }

  /**
   * 프로모션 재고 수량보다 적은지 혹은 같거나 많은지 확인하여 안내 메시지 분기 처리
   * @param {string} productName 
   * @param {number} productQuantity 
   */
  async #checkAndMessageStockQuantity(productName, productQuantity) {
    const promotionQuantity = this.#stock.getPromotionStockQuantity(productName);
    if (productQuantity < promotionQuantity) {
      await this.#messageAdditionalQuantity(productName, productQuantity);
      return;
    }
    await this.#messageFullPricePaymentForSomeQuantities(productName, productQuantity, promotionQuantity);
  }

  /**
   * 프로모션 혜택 증정 수량 추가 가능한 경우 안내 메시지 출력
   *  - Y: 프로모션 혜택 증정 수량 추가 / N: 해당 수량에 대해 프로모션 혜택 적용 안함
   * 
   * 1) 해당 상품에 대한 프로모션 정보 가져오기
   * 2) 해당 프로모션의 buy, get, buy + get 가져오기
   * 3) 계산: {productQuantity} % {buy + get} === {buy} 인 경우 {get} 만큼 수량 추가 가능 안내
   *    - 2+1 : 7개 구매, 2+1 + 2+1 + 1 -> 7 % 3 = 1개 남음 !== buy 이므로 안내 필요 X
   *    - 2+1 : 8개 구매, 2+1 + 2+1 + 2 -> 2개 남음 === buy 이므로 get만큼 더 받을 수 있다는 안내 필요 O
   *    - 1+1 : 3개 구매, 1+1 + 1 -> 1개 남음 === buy 이므로 get만큼 더 받을 수 있다는 안내 필요 O
   * @param {string} productName 
   * @param {number} productQuantity 
   */
  async #messageAdditionalQuantity(productName, productQuantity) {
    const promotionName = this.#stock.getPromotionName(productName);
    const buy = this.#promotion.getPromotionBuy(promotionName);
    const get = this.#promotion.getPromotionGet(promotionName);
    const buyPlusGet = this.#promotion.getPromotionBuyPlusGet(promotionName);
    
    const isAvailableAdditionalQuantity = productQuantity % buyPlusGet === buy;
    if (isAvailableAdditionalQuantity) {
      const userConfirm = await getUserConfirm(`현재 ${productName}은(는) ${get}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`);
      if (userConfirm) {
        // Y: 프로모션 혜택 증정 수량 추가
      }
    }
  }

  /**
   * 재고 부족에 대한 일부 수량 정가 결제 안내 메시지 출력
   *  - Y: 일부 수량 정가 결제 / N: 일부 수량 결제 취소
   * 
   * 1) 해당 상품에 대한 프로모션 가져오기
   * 2) {정가 결제할 수량} = {프로모션 재고 수량} % {buy + get} + (현재 상품 수량 - 프로모션 재고 수량)
   * @param {string} productName 
   * @param {number} productQuantity 
   * @param {number} promotionQuantity
   */
  async #messageFullPricePaymentForSomeQuantities(productName, productQuantity, promotionQuantity) {
    const promotionName = this.#stock.getPromotionName(productName);
    const buyPlusGet = this.#promotion.getPromotionBuyPlusGet(promotionName);
    const fullPricePaymentForSomeQuantities = (promotionQuantity % buyPlusGet) + (productQuantity - promotionQuantity);

    const userConfirm = await getUserConfirm(`현재 ${productName} ${fullPricePaymentForSomeQuantities}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`);
    if (!userConfirm) {
      // N: 일부 수량 결제 취소
    }
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
