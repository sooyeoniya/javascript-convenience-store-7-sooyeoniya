import fs from 'fs';

class Promotion {
  #promotionInfo = [];

  constructor() {
    this.#initPromotionInfo();
  }

  // 프로모션 전체 정보 반환
  getPromotionInfo() {
    return this.#promotionInfo;
  }

  // 해당하는 프로모션 정보 반환
  getPromotionInfoByName(promotionName) {
    return this.#promotionInfo.find((promotion) => promotion.name === promotionName);
  }

  // 해당하는 프로모션에 대한 buy 값 반환
  getPromotionBuyValue(promotionName) {
    const promotion = this.getPromotionInfoByName(promotionName);
    return promotion.buy;
  }

  // 해당하는 프로모션에 대한 get 값 반환
  getPromotionGetValue(promotionName) {
    const promotion = this.getPromotionInfoByName(promotionName);
    return promotion.get;
  }
  
  // 해당하는 프로모션에 대한 buy + get 값 반환
  getPromotionBuyPlusGetValue(promotionName) {
    const promotion = this.getPromotionInfoByName(promotionName);
    return promotion.buy + promotion.get;
  }

  // 오늘 날짜 기준으로 프로모션 적용 기간인지 확인
  #isPromotionAvailable() {
    // TODO: @woowacourse/mission-utils에서 제공하는 Console 및 DateTimes API를 사용하여 구현해야 한다.
    // 현재 날짜와 시간을 가져오려면 DateTimes의 now()를 활용한다.
    const currentDate = new Date();
    this.#promotionInfo.forEach((promotion) => {
      const isPromotionAvailable = currentDate >= promotion.startDate && currentDate <= promotion.endDate;
      promotion.isAvailable = isPromotionAvailable;
    });
  }

  // 파일 읽기
  #readPromotionInfoFromFile() {
    const promotionInfo = fs.readFileSync('public/promotions.md', 'utf-8').trim().split('\n');
    promotionInfo.shift();

    return promotionInfo;
  }

  // 파일 내용 파싱
  #parsePromotionInfo(promotion) {
    let [name, buy, get, startDate, endDate] = promotion.split(',');
    buy = Number(buy);
    get = Number(get);
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    return { name, buy, get, startDate, endDate };
  }

  // promotionInfo 필드 초기화
  #initPromotionInfo() {
    const promotionInfo = this.#readPromotionInfoFromFile();

    promotionInfo.forEach((promotion) => {
      const parsedPromotion = this.#parsePromotionInfo(promotion);
      if (parsedPromotion) this.#promotionInfo.push(parsedPromotion);
    });
    this.#isPromotionAvailable();
  }
}

export default Promotion;
