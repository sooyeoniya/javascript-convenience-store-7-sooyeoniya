import fs from 'fs';

class Stock {
  #stockInfo = [];

  constructor() {
    this.#initStockInfo();
  }

  // 전체 재고 정보 반환
  getStockInfo() {
    return this.#stockInfo;
  }

  // 현재 상품에 대한 프로모션 재고 정보 반환
  getProductPromotionStockInfo(productName) {
    return this.#stockInfo.find((product) => product.name === productName && product.promotion !== null);
  }

  // 현재 상품에 대한 일반 재고 정보 반환
  getProductGeneralStockInfo(productName) {
    return this.#stockInfo.find((product) => product.name === productName && product.promotion === null);
  }

  // 현재 상품에 대한 프로모션 이름 (프로모션 혜택 있는 경우 프로모션 혜택 이름 먼저 반환, 없으면 null 반환)
  getPromotionName(productName) {
    return this.#stockInfo.find((product) => product.name === productName).promotion;
  }
  
  // 현재 상품에 대한 프로모션 재고 수량
  getPromotionStockQuantity(productName) {
    const promotionName = this.getPromotionName(productName);
    const product = this.#stockInfo.find((product) => 
      product.name === productName && promotionName && product.promotion === promotionName
    );
    return product.quantity;
  }

  // 현재 상품에 대한 일반 재고 수량
  getGeneralStockQuantity(productName) {
    const product = this.#stockInfo.find((product) => 
      product.name === productName && product.promotion === null
    );
    return product.quantity;
  }

  // {프로모션 재고 수량} > {현재상품수량} 인 경우, 프로모션 재고 업데이트: {프로모션 재고 수량} - {현재상품수량}
  // {프로모션 재고 수량} <= {현재상품수량} 인 경우, 프로모션 재고 우선 차감 후, 나머지 일반 재고 차감
  updateStockInfo(productName, productQuantity) {
    const productPromotionStockInfo = this.getProductPromotionStockInfo(productName);
    const productGeneralStockInfo = this.getProductGeneralStockInfo(productName);
    const promotionStockQuantity = productPromotionStockInfo.quantity;
    if (promotionStockQuantity > productQuantity) {
      productPromotionStockInfo.quantity -= productQuantity;
    } else {
      productPromotionStockInfo.quantity = 0;
      productGeneralStockInfo.quantity -= (productQuantity - promotionStockQuantity);
    }
  }

  // 파일 읽기
  #readStockInfoFromFile() {
    const stockInfo = fs.readFileSync('public/products.md', 'utf-8').trim().split('\n');
    stockInfo.shift();

    return stockInfo;
  }

  // 파일 내용 파싱
  #parseProductInfo(productInfo) {
    let [name, price, quantity, promotion] = productInfo.split(',');

    if (promotion === 'null') promotion = null;
    price = Number(price);
    quantity = Number(quantity);

    return { name, price, quantity, promotion };
  }

  // stockInfo 필드 초기화
  #initStockInfo() {
    const stockInfo = this.#readStockInfoFromFile();

    stockInfo.forEach((productInfo) => {
      const product = this.#parseProductInfo(productInfo);
      if (product) this.#stockInfo.push(product);
    });
  }
}

export default Stock;
