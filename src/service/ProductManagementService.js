import { CONFIRMATION_RESPONSES } from '../constants/constants.js';
import getUserConfirmation from '../utils/getUserConfirmation.js';

class ProductManagementService {
  #stock;
  #promotion;
  #productsInfo;

  constructor(stock, promotion) {
    this.#stock = stock;
    this.#promotion = promotion;
    this.#productsInfo = [];
  }

  // 구매할 상품 및 수량 저장
  initProductsInfo(productsInfo) {
    this.#productsInfo = productsInfo;
  }

  // 구매할 상품 및 수량 전체 정보 반환
  getProductsInfo() {
    return this.#productsInfo;
  }

  // 재고 수량 초과하는지 확인
  hasSufficientStock(productName, requestedQuantity) {
    const totalQuantity = this.#calculateTotalQuantity(productName);
    return totalQuantity >= requestedQuantity;
  }

  // 구매할 상품들에 대한 처리 로직
  async processProducts() {
    for (const { name, quantity } of this.#productsInfo) {
      if (this.#isGeneralProduct(name, quantity)) continue;
      await this.#processPromotionStock(name, quantity);
    }
  }

  // 프로모션 미적용 상품 처리
  #isGeneralProduct(name, quantity) {
    if (!this.#isAvailablePromotion(name)) {
      this.#stock.updateGeneralStockInfo(name, quantity);
      this.#initGiftCount(name);
      return true;
    }
    return false;
  }

  // 프로모션 적용 상품에 대한 재고 처리 로직
  async #processPromotionStock(name, quantity) {
    const productInfo = this.#getProductInfo(name);
    const productPromotionStockQuantity = this.#stock.getPromotionStockQuantity(name);
    if (productPromotionStockQuantity > quantity) {
      await this.#processSufficientPromotionStock(name, quantity, productInfo);
      return;
    }
    await this.#processInsufficientPromotionStock(name, quantity, productInfo, productPromotionStockQuantity);
  }

  // 프로모션 재고가 충분한 경우
  async #processSufficientPromotionStock(productName, productQuantity, productInfo) {
    await this.#offerAdditionalPromotionItems(productName, productQuantity);
    this.#setGiftCount(productInfo, productName, productInfo.quantity);
    this.#stock.updatePromotionStockInfo(productName, productInfo.quantity);
  }

  // 프로모션 재고가 충분하지 않은 경우
  async #processInsufficientPromotionStock(productName, productQuantity, productInfo, productPromotionStockQuantity) {
    await this.#offerLackOfPromotionStock(productName, productQuantity, productPromotionStockQuantity);
    this.#setGiftCount(productInfo, productName, productPromotionStockQuantity);
    this.#stock.updatePromotionStockInfo(productName, productInfo.quantity);
  }

  // 프로모션 미적용 상품에 대한 증정품 개수 초기화
  #initGiftCount(productName) {
    const productInfo = this.#getProductInfo(productName);
    productInfo.giftCount = 0;
  }

  // 프로모션 적용 상품에 대한 증정품 개수 계산
  #setGiftCount(productInfo, productName, applicablePromotionQuantity) {
    const promotionName = this.#stock.getPromotionName(productName);
    const promotionBuyPlusGetValue = this.#promotion.getPromotionBuyPlusGetValue(promotionName);
    productInfo.giftCount = Math.floor(applicablePromotionQuantity / promotionBuyPlusGetValue);
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
    const response = await getUserConfirmation(
      `\n현재 ${productName}은(는) ${promotionGetValue}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`
    );
    if (response === CONFIRMATION_RESPONSES.YES) return productQuantity + promotionGetValue;
    if (response === CONFIRMATION_RESPONSES.NO) return productQuantity;
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
    const response = await getUserConfirmation(
      `\n현재 ${productName} ${nonPromotionalQuantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`
    );
    if (response === CONFIRMATION_RESPONSES.YES) return productQuantity;
    if (response === CONFIRMATION_RESPONSES.NO) return productQuantity - nonPromotionalQuantity;
  }

  // 총 재고 수량 계산
  #calculateTotalQuantity(productName) {
    if (this.#isAvailablePromotion(productName)) {
      return this.#sumProductQuantity((product) => product.name === productName);
    }
    return this.#sumProductQuantity((product) => product.name === productName && product.promotion === null);
  }

  // 프로모션 적용 가능한 상품인지 아닌지 확인
  #isAvailablePromotion(productName) {
    const promotionInfo = this.#promotion.getPromotionInfo();
    const promotionName = this.#stock.getPromotionName(productName);

    return promotionName && promotionInfo.some((promotion) => promotion.name === promotionName && promotion.isAvailable);
  }

  // 특정 조건에 대한 상품 수량 덧셈
  #sumProductQuantity(condition) {
    return this.#stock.getStockInfo().reduce((totalQuantity, product) => {
      if (condition(product)) totalQuantity += product.quantity;
      return totalQuantity;
    }, 0);
  }

  // 해당하는 상품에 대한 상품 및 수량 정보 반환
  #getProductInfo(productName) {
    return this.#productsInfo.find((product) => product.name === productName);
  }
}

export default ProductManagementService;
