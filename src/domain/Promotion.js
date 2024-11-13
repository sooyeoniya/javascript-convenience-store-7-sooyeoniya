import { MissionUtils } from '@woowacourse/mission-utils';
import { DELIMITER } from '../constants/constants.js';
import readFileData from '../utils/readFileData.js';

class Promotion {
  #promotionInfo = [];

  constructor() {
    this.#initPromotionInfo();
  }

  // 프로모션 전체 정보 반환
  getPromotionInfo() {
    return this.#promotionInfo;
  }

  // 해당하는 프로모션에 대한 buy 값 반환
  getPromotionBuyValue(promotionName) {
    const promotion = this.#getPromotionInfoByName(promotionName);
    return promotion.buy;
  }

  // 해당하는 프로모션에 대한 get 값 반환
  getPromotionGetValue(promotionName) {
    const promotion = this.#getPromotionInfoByName(promotionName);
    return promotion.get;
  }

  // 해당하는 프로모션에 대한 buy + get 값 반환
  getPromotionBuyPlusGetValue(promotionName) {
    const promotion = this.#getPromotionInfoByName(promotionName);
    return promotion.buy + promotion.get;
  }

  // 해당하는 프로모션 정보 반환
  #getPromotionInfoByName(promotionName) {
    return this.#promotionInfo.find((promotion) => promotion.name === promotionName);
  }

  // 오늘 날짜 기준으로 프로모션 적용 기간인지 확인
  #isPromotionAvailable() {
    const currentDate = MissionUtils.DateTimes.now();
    this.#promotionInfo.forEach((promotion) => {
      const isPromotionAvailable = currentDate >= promotion.startDate && currentDate <= promotion.endDate;
      promotion.isAvailable = isPromotionAvailable;
    });
  }

  // 파일 내용 파싱
  #parsePromotionInfo(promotion) {
    let [name, buy, get, startDate, endDate] = promotion.split(DELIMITER);

    buy = Number(buy);
    get = Number(get);

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    return { name, buy, get, startDate, endDate };
  }

  // promotionInfo 필드 초기화
  #initPromotionInfo() {
    const promotionInfo = readFileData('public/promotions.md');

    promotionInfo.forEach((promotion) => {
      const parsedPromotion = this.#parsePromotionInfo(promotion);
      if (parsedPromotion) this.#promotionInfo.push(parsedPromotion);
    });
    this.#isPromotionAvailable();
  }
}

export default Promotion;
