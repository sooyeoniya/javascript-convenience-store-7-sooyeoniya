import fs from 'fs';

class Promotion {
  #promotionInfo = [];

  constructor() {
    this.#initPromotionInfo();
  }

  getPromotionInfo() {
    return this.#promotionInfo;
  }

  #readPromotionInfoFromFile() {
    const promotionInfo = fs.readFileSync('public/promotions.md', 'utf-8').trim().split('\n');
    promotionInfo.shift();

    return promotionInfo;
  }

  #parsePromotionInfo(promotion) {
    let [name, buy, get, startDate, endDate] = promotion.split(',');
    buy = Number(buy);
    get = Number(get);
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    return { name, buy, get, startDate, endDate };
  }

  #isPromotionAvailable() {
    const currentDate = new Date();
    this.#promotionInfo.forEach((promotion) => {
      const isPromotionAvailable = currentDate >= promotion.startDate && currentDate <= promotion.endDate;
      promotion.isAvailable = isPromotionAvailable;
    });
  }

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
