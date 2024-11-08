import Stock from '../domain/Stock.js';
import Promotion from '../domain/Promotion.js';

class ConvenienceStoreService {
  #stock;
  #promotion;
  #productsInfo;
  #receiptInfo;

  constructor() {
    this.#stock = new Stock();
    this.#promotion = new Promotion();
    this.#productsInfo = [];
    this.#receiptInfo = [];
  }

  // 구매할 상품 및 수량 저장
  initProductsInfo(productsInfo) {
    this.#productsInfo = productsInfo;
  }

  // 구매할 상품 및 수량 전체 정보 반환
  getProductsInfo() {
    return this.#productsInfo;
  }

  // 해당하는 구매할 상품 및 수량 정보 반환
  getProductInfo(productName) {
    return this.#productsInfo.find((product) => product.name === productName);
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
        if (productPromotionStockQuantity > quantity) {

          await this.#offerAdditionalPromotionItems(name, quantity);
          const productInfo = this.getProductInfo(name);
          this.#updateGiftCountWhenStockIsSufficient(productInfo, name, productInfo.quantity);
          this.#stock.updatePromotionStockInfo(name, productInfo.quantity);

        } else {

          await this.#offerLackOfPromotionStock(name, quantity, productPromotionStockQuantity);
          const productInfo = this.getProductInfo(name);
          this.#updateGiftCountWhenStockIsInsufficient(productInfo, name, productPromotionStockQuantity);
          this.#stock.updatePromotionStockInfo(name, productInfo.quantity);

        }
      }
    };
  }

  // 프로모션 미적용 상품에 대한 전체 로직 관리
  async processGeneralProduct() {
    this.#productsInfo.forEach(({ name, quantity }) => {
      if (!this.#isAvailablePromotion(name)) {
        this.#stock.updateGeneralStockInfo(name, quantity);
      }
    });
  }

  // 증정품 개수 추가: {프로모션 재고 수량} > {현재상품수량} 인 경우, {증정품 개수} = {현재상품수량} / 3 or 2
  #updateGiftCountWhenStockIsSufficient(productInfo, productName, productQuantity) {
    const promotionName = this.#stock.getPromotionName(productName);
    const promotionBuyPlusGetValue = this.#promotion.getPromotionBuyPlusGetValue(promotionName);
    productInfo.giftCount = Math.floor(productQuantity / promotionBuyPlusGetValue);
  }

  // 증정품 개수 추가: {프로모션 재고 수량} <= {현재상품수량} 인 경우, {증정품 개수} = {프로모션 재고 수량} / 3 or 2
  #updateGiftCountWhenStockIsInsufficient(productInfo, productName, productPromotionStockQuantity) {
    const promotionName = this.#stock.getPromotionName(productName);
    const promotionBuyPlusGetValue = this.#promotion.getPromotionBuyPlusGetValue(promotionName);
    productInfo.giftCount = Math.floor(productPromotionStockQuantity / promotionBuyPlusGetValue);
  }

  // 구매할 상품에 대한 수량 갱신
  #updateProductQuantity(productName, renewProductQuantity) {
    const product = this.#productsInfo.find((product) => product.name === productName);
    product.quantity = renewProductQuantity;
  }

  // 프로모션 적용 가능 상품에 대해 고객이 해당 수량보다 적게 가져왔는지에 대한 안내 메시지 출력 및 수량 갱신
  async #offerAdditionalPromotionItems(productName, productQuantity) {
    const promotionName = this.#stock.getPromotionName(productName);
    const promotionBuyValue = this.#promotion.getPromotionBuyValue(promotionName);
    const promotionGetValue = this.#promotion.getPromotionGetValue(promotionName);
    const promotionBuyPlusGetValue = this.#promotion.getPromotionBuyPlusGetValue(promotionName);
    if (productQuantity % promotionBuyPlusGetValue === promotionBuyValue) {
      const renewProductQuantity = await this.#showAdditionalPromotionItemsMessage(productName, productQuantity, promotionGetValue);
      this.#updateProductQuantity(productName, renewProductQuantity);
    }
  }

  // 추가 구매 안내 메시지 답변에 따른 구매할 수량 재계산
  async #showAdditionalPromotionItemsMessage(productName, productQuantity, promotionGetValue) {
    const response = await this.getUserConfirmation(
      `현재 ${productName}은(는) ${promotionGetValue}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`
    );
    if (response.toUpperCase() === 'Y') return productQuantity + promotionGetValue;
    if (response.toUpperCase() === 'N') return productQuantity;
  }

  // 프로모션 재고가 부족한 것에 대한 안내 메시지 출력 및 수량 갱신
  async #offerLackOfPromotionStock(productName, productQuantity, productPromotionStockQuantity) {
    const promotionName = this.#stock.getPromotionName(productName);
    const promotionBuyPlusGetValue = this.#promotion.getPromotionBuyPlusGetValue(promotionName);
    const nonPromotionalQuantity = (productPromotionStockQuantity % promotionBuyPlusGetValue) + (productQuantity - productPromotionStockQuantity);
    const renewProductQuantity = await this.#showLackOfPromotionStockMessage(productName, productQuantity, nonPromotionalQuantity);
    this.#updateProductQuantity(productName, renewProductQuantity);
  }

  // 재고 부족 안내 메시지 답변에 따른 구매할 수량 재계산
  async #showLackOfPromotionStockMessage(productName, productQuantity, nonPromotionalQuantity) {
    const response = await this.getUserConfirmation(
      `현재 ${productName} ${nonPromotionalQuantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`
    );
    if (response.toUpperCase() === 'Y') return productQuantity;
    if (response.toUpperCase() === 'N') return productQuantity - nonPromotionalQuantity;
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
