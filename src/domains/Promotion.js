import { DateTimes } from '@woowacourse/mission-utils';
import getFileData from '../utils/getFileData.js';

class Promotion {
  /** @type {Array<{ name: string, buy: number, get: number }>} */ #promotionInfo = [];

  constructor() {
    this.#initPromotionInfo();
  }

  /**
   * 해당 프로모션에 대한 정보 반환
   * @param {string} promotionName 
   * @returns {{ name: string, buy: number, get: number }}
   */
  #getPromotion(promotionName) {
    return this.#promotionInfo.find((promotion) => promotion.name === promotionName);
  }

  /**
   * 해당 프로모션에 대한 buy 값 반환
   * @param {string} promotionName 
   * @returns {number}
   */
  getPromotionBuy(promotionName) {
    return this.#getPromotion(promotionName).buy;
  }

  /**
   * 해당 프로모션에 대한 get 값 반환
   * @param {string} promotionName 
   * @returns {number}
   */
  getPromotionGet(promotionName) {
    return this.#getPromotion(promotionName).get;
  }

  /**
   * 해당 프로모션에 대한 buy + get 값 반환
   * @param {string} promotionName 
   * @returns {number}
   */
  getPromotionBuyPlusGet(promotionName) {
    return this.getPromotionBuy(promotionName) + this.getPromotionGet(promotionName);
  }

  /**
   * 해당 프로모션 기간인지 확인, #promotionInfo에 존재하면 현재 적용 가능한 프로모션임
   * promotionName이 존재하지 않으면 false, promotionName이 존재하면 true 반환
   * @returns {boolean}
   */
  hasPromotion(promotionName) {
    return this.#promotionInfo.some((promotion) => promotion.name === promotionName);  
  }

  #checkPromotionPeriod(startDate, endDate) {
    const currentDate = DateTimes.now();
    return currentDate >= startDate && currentDate <= endDate;
  }

  #parsePromotionInfo(promotionInfo) {
    let [ name, buy, get, startDate, endDate ] = promotionInfo.split(',');
    
    buy = Number(buy);
    get = Number(get);

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (this.#checkPromotionPeriod(startDate, endDate)) {
      return { name, buy, get };
    }
  }

  #initPromotionInfo() {
    const promotionsInfo = getFileData('public/promotions.md');

    promotionsInfo.forEach((promotionInfo) => {
      const parsedPromotionInfo = this.#parsePromotionInfo(promotionInfo);
      if (parsedPromotionInfo) this.#promotionInfo.push(parsedPromotionInfo);
    });
  }
}

export default Promotion;
