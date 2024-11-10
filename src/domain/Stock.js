import { STOCK_LABELS, DELIMITER } from '../constants/constants.js';
import readFileData from '../utils/readFileData.js';

class Stock {
  #stockInfo = [];

  constructor() {
    this.#initStockInfo();
  }

  // 전체 재고 정보 반환
  getStockInfo() {
    return this.#stockInfo;
  }

  // 특정 상품에 대한 가격 반환
  getProductPrice(productName) {
    return this.#stockInfo.find((product) => product.name === productName).price;
  }

  // 프로모션 혜택 상품에 대한 프로모션 재고 수량 반환
  getPromotionStockQuantity(productName) {
    const promotionName = this.getPromotionName(productName);
    const product = this.#stockInfo.find((product) => 
      product.name === productName && promotionName && product.promotion === promotionName
    );
    return product?.quantity;
  }

  // 특정 상품에 대한 프로모션 이름 반환 (프로모션 혜택 있는 경우 프로모션 혜택 이름 먼저 반환, 없으면 null 반환)
  getPromotionName(productName) {
    return this.#stockInfo.find((product) => product.name === productName).promotion;
  }

  // 존재하는 상품인지 확인
  checkProductExistence(productName) {
    return this.#stockInfo.some((product) => product.name === productName);
  }

  // 프로모션 적용 상품에 대한 재고 차감
  updatePromotionStockInfo(productName, productQuantity) {
    const productPromotionStockInfo = this.#getProductPromotionStockInfo(productName);
    const productGeneralStockInfo = this.#getProductGeneralStockInfo(productName);
    const promotionStockQuantity = productPromotionStockInfo.quantity;
    if (promotionStockQuantity > productQuantity) {
      productPromotionStockInfo.quantity -= productQuantity;
      return;
    }
    productPromotionStockInfo.quantity = 0;
    productGeneralStockInfo.quantity -= (productQuantity - promotionStockQuantity);
  }

  // 프로모션 미적용 상품에 대한 일반 재고 차감
  updateGeneralStockInfo(productName, productQuantity) {
    const productGeneralStockInfo = this.#getProductGeneralStockInfo(productName);
    productGeneralStockInfo.quantity -= productQuantity;
  }

  // 재고에 있는 상품 중에 promotion null이 없는 경우, 상품 수량 0으로 일반 재고 새로 추가
  #hasGeneralStockInfo() {
    const productNames = [...new Set(this.#stockInfo.map((product) => product.name))];

    productNames.forEach((name) => {
      const hasGeneralStock = this.#stockInfo.some((product) => product.name === name && product.promotion === null);
      if (!hasGeneralStock) {
        const productWithPromotion = this.#getProductPromotionStockInfo(name);
        const promotionIndex = this.#getPromotionIndex(name);
        this.#addGeneralStockInfo(name, productWithPromotion.price, promotionIndex);
      }
    });
  }

  // 해당 프로모션 상품의 위치 반환
  #getPromotionIndex(productName) {
    return this.#stockInfo
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => product.name === productName && product.promotion !== null)
      .slice(-1)[0].index;
  }

  // 해당 프로모션 상품 항목 바로 뒤에 삽입
  #addGeneralStockInfo(name, price, promotionIndex) {
    this.#stockInfo.splice(promotionIndex + 1, 0, {
      name,
      price,
      quantity: 0,
      promotion: null,
    });
  }

  // 현재 상품에 대한 프로모션 재고 정보 반환
  #getProductPromotionStockInfo(productName) {
    return this.#stockInfo.find((product) => product.name === productName && product.promotion !== null);
  }

  // 현재 상품에 대한 일반 재고 정보 반환
  #getProductGeneralStockInfo(productName) {
    return this.#stockInfo.find((product) => product.name === productName && product.promotion === null);
  }

  // 파일 내용 파싱
  #parseProductInfo(productInfo) {
    let [name, price, quantity, promotion] = productInfo.split(DELIMITER);

    if (promotion === STOCK_LABELS.NULL) promotion = null;
    price = Number(price);
    quantity = Number(quantity);

    return { name, price, quantity, promotion };
  }

  // stockInfo 필드 초기화
  #initStockInfo() {
    const stockInfo = readFileData('public/products.md');

    stockInfo.forEach((productInfo) => {
      const product = this.#parseProductInfo(productInfo);
      if (product) this.#stockInfo.push(product);
    });
    this.#hasGeneralStockInfo();
  }
}

export default Stock;
