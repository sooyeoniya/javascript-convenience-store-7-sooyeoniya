import { DateTimes } from '@woowacourse/mission-utils';
import getFileData from '../utils/getFileData.js';

class Promotion {
  /** @type {Array<{ name: string, buy: number, get: number }>} */ #promotionInfo = [];

  constructor() {
    this.#initPromotionInfo();
  }

  getPromotionInfo() {
    return this.#promotionInfo;
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
