import Stock from '../domain/Stock.js';
import Promotion from '../domain/Promotion.js';

class ConvenienceStoreService {
  #stock;
  #promotion;
  #productsInfo;
  #giftsInfo;

  constructor() {
    this.#stock = new Stock();
    this.#promotion = new Promotion();
    this.#productsInfo = [];
    this.#giftsInfo = [];
  }

  // 구매할 상품 및 수량 저장
  initProductsInfo(productsInfo) {
    this.#productsInfo = productsInfo;
  }

  // 재고 정보 받아오기
  getStockInfo() {
    return this.#stock.getStockInfo();
  }

  processProductPromotions() {
    // 프로모션 관련 로직 구현
    this.#productsInfo.forEach(({ name, quantity }) => {
      if (this.#isAvailablePromotion(name)) {
        
      } else {
        
      }
    });
  }

  // 존재하는 상품인지 확인
  checkProductExistence(productName) {
    return this.#stock.getStockInfo().some((product) => product.name === productName);
  }

  // 재고 수량 초과하는지 확인
  hasSufficientStock(productName, requestedQuantity) {
    const totalQuantity = this.#calculateTotalQuantity(productName);
    return totalQuantity >= requestedQuantity;
  }

  // 프로모션 적용 가능한 상품인지 아닌지 확인
  #isAvailablePromotion(productName) {
    const promotionInfo = this.#promotion.getPromotionInfo();
    const productPromotion = this.#stock.getStockInfo().find((product) => product.name === productName).promotion;

    return productPromotion && promotionInfo.some((promotion) => promotion.name === productPromotion && promotion.isAvailable);
  }

  // 총 재고 수량 계산
  #calculateTotalQuantity(productName) {
    let totalQuantity = 0;
    if (this.#isAvailablePromotion(productName)) {
      this.#stock.getStockInfo().forEach((product) => {
        if (product.name === productName) totalQuantity += product.quantity;
      });
      return totalQuantity;
    }
    this.#stock.getStockInfo().forEach((product) => {
      if (product.name === productName && product.promotion === null) totalQuantity += product.quantity;
    });
    return totalQuantity;
  }
}

export default ConvenienceStoreService;
