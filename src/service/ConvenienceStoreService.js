import Stock from '../domain/Stock.js';
import Promotion from '../domain/Promotion.js';
import OutputView from '../view/OutputView.js';

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

  // 존재하는 상품인지 확인
  checkProductExistence(productName) {
    return this.#stock.getStockInfo().some((product) => product.name === productName);
  }

  // 재고 수량 초과하는지 확인
  hasSufficientStock(productName, requestedQuantity) {
    const totalQuantity = this.#calculateTotalQuantity(productName);
    return totalQuantity >= requestedQuantity;
  }

  // 프로모션 할인 전체 로직 관리
  async processProductPromotions() {
    for (const { name, quantity } of this.#productsInfo) {
      if (this.#isAvailablePromotion(name)) {
        const productPromotionStockQuantity = this.#stock.getPromotionStockQuantity(name);
        if (productPromotionStockQuantity > quantity) await this.#offerAdditionalPromotionItems(name, quantity);
        else await this.#offerInsufficientPromotionStock(name, quantity);
      }
    };
  }

  // 프로모션 미적용 상품에 대한 전체 로직 관리
  async processGeneralProduct() {
    for (const { name, quantity } of this.#productsInfo) {
      if (!this.#isAvailablePromotion(name)) {
        // 일반 재고로 계산
      }
    };
  }

  // 프로모션 적용 가능 상품에 대해 고객이 해당 수량보다 적게 가져왔는지 확인
  async #offerAdditionalPromotionItems(productName, productQuantity) {
    const promotionName = this.#stock.getPromotionName(productName);
    const promotionBuyValue = this.#promotion.getPromotionBuyValue(promotionName);
    const promotionGetValue = this.#promotion.getPromotionGetValue(promotionName);
    const promotionBuyPlusGetValue = this.#promotion.getPromotionBuyPlusGetValue(promotionName);
    if (productQuantity % promotionBuyPlusGetValue === promotionBuyValue) {
      const renewProductQuantity = await this.#renewProductQuantity(productName, productQuantity, promotionGetValue);
      // console.log(renewProductQuantity);
      // TODO: renewProductQuantity 값을 productsInfo의 해당 productQuantity에 갱신
    }
  }

  // 안내 메시지 답변에 따른 구매할 수량 재계산
  async #renewProductQuantity(productName, productQuantity, promotionGetValue) {
    const response = await this.getUserConfirmation(
      `현재 ${productName}은(는) ${promotionGetValue}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`
    );
    if (response.toUpperCase() === 'Y') return productQuantity + promotionGetValue;
    if (response.toUpperCase() === 'N') return productQuantity;
  }

  // 프로모션 재고가 부족한지 확인
  async #offerInsufficientPromotionStock(productName, productQuantity) {
    // - {수량} = [{프로모션 재고 수량} % 3 or 2] + [{현재상품수량} - {프로모션 재고 수량}]
    // - 부족한 경우, "현재 {상품명} {수량}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)"
    // - Y: 아무것도 하지 않음, N: {현재상품수량} - {수량}개, 잘못 입력한 경우: 다시 입력받기
    // `현재 {상품명} {수량}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`
  }

  // 프로모션 적용 가능한 상품인지 아닌지 확인
  #isAvailablePromotion(productName) {
    const promotionInfo = this.#promotion.getPromotionInfo();
    const promotionName = this.#stock.getPromotionName(productName);

    return promotionName && promotionInfo.some((promotion) => promotion.name === promotionName && promotion.isAvailable);
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
