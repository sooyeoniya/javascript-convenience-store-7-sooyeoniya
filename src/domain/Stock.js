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

  // 현재 상품에 대한 프로모션 이름
  getPromotionName(productName) {
    return this.#stockInfo.find((product) => product.name === productName).promotion;
  }
  
  // 현재 상품에 대한 프로모션 재고 수량
  getPromotionStockQuantity(productName) {
    const promotionName = this.getPromotionName(productName);
    const product = this.#stockInfo.find((product) => 
      product.name === productName && product.promotion === promotionName
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
