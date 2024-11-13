import Stock  from '../src/domain/Stock.js';
import readFileData from '../src/utils/readFileData.js';

jest.mock('../src/utils/readFileData.js');

describe('Stock 클래스 테스트', () => {
  let stock;

  beforeEach(() => {
    // given
    readFileData.mockReturnValue([
      '콜라,1000,10,탄산2+1',
      '콜라,1000,10,null',
      '오렌지주스,1800,9,MD추천상품',
      '오렌지주스,1800,0,null',
      '에너지바,2000,5,null',
    ]);
    stock = new Stock();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getStockInfo(): 초기화된 전체 재고 정보를 반환한다.', () => {
    // when
    const stockInfo = stock.getStockInfo();

    // then
    expect(stockInfo).toEqual([
      { name: '콜라', price: 1000, quantity: 10, promotion: '탄산2+1' },
      { name: '콜라', price: 1000, quantity: 10, promotion: null },
      { name: '오렌지주스', price: 1800, quantity: 9, promotion: 'MD추천상품' },
      { name: '오렌지주스', price: 1800, quantity: 0, promotion: null },
      { name: '에너지바', price: 2000, quantity: 5, promotion: null },
    ]);
  });

  test('getProductPrice(): 특정 상품에 대한 가격을 반환한다.', () => {
    // given: 상품명
    // when
    const cokePrice = stock.getProductPrice('콜라');
    const orangeJuicePrice = stock.getProductPrice('오렌지주스');
    const energyBarPrice = stock.getProductPrice('에너지바');

    // then
    expect(cokePrice).toBe(1000);
    expect(orangeJuicePrice).toBe(1800);
    expect(energyBarPrice).toBe(2000);
  });

  test('getPromotionStockQuantity(): 프로모션 혜택 상품에 대한 프로모션 재고 수량을 반환한다.', () => {
    // given: 상품명
    // when
    const cokeQuantity = stock.getPromotionStockQuantity('콜라');
    const orangeJuiceQuantity = stock.getPromotionStockQuantity('오렌지주스');
    const energyBarQuantity = stock.getPromotionStockQuantity('에너지바');

    // then
    expect(cokeQuantity).toBe(10);
    expect(orangeJuiceQuantity).toBe(9);
    expect(energyBarQuantity).toBeUndefined();
  });

  test('getPromotionName(): 특정 상품에 대한 프로모션 이름을 반환한다.', () => {
    // given: 상품명
    // when
    const cokePromotionName = stock.getPromotionName('콜라');
    const orangeJuicePromotionName = stock.getPromotionName('오렌지주스');
    const energyBarPromotionName = stock.getPromotionName('에너지바');

    // then
    expect(cokePromotionName).toBe('탄산2+1');
    expect(orangeJuicePromotionName).toBe('MD추천상품');
    expect(energyBarPromotionName).toBeNull();
  });

  test('checkProductExistence(): 특정 상품에 대한 존재 여부를 반환한다.', () => {
    // given: 상품명
    // when
    const cokeExists = stock.checkProductExistence('콜라');
    const nonExistent = stock.checkProductExistence('없는상품');

    // then
    expect(cokeExists).toBe(true);
    expect(nonExistent).toBe(false);
  });

  test('updatePromotionStockInfo(): 프로모션 재고가 구매할 수량보다 많은 경우, 프로모션 재고에서만 차감한다.', () => {
    // given
    const productName = '콜라';
    const productQuantity = 5;

    // when
    stock.updatePromotionStockInfo(productName, productQuantity);

    // then
    const updatedStockInfo = stock.getStockInfo();
    const promotionStock = updatedStockInfo.find(item => item.name === productName && item.promotion === '탄산2+1');
    const generalStock = updatedStockInfo.find(item => item.name === productName && item.promotion === null);

    expect(promotionStock.quantity).toBe(5);
    expect(generalStock.quantity).toBe(10);
  });

  test('updatePromotionStockInfo(): 프로모션 재고가 구매할 수량보다 적은 경우, 프로모션 재고 모두 차감 후 나머지는 일반 재고에서 차감한다.', () => {
    // given
    const productName = '콜라';
    const productQuantity = 15;

    // when
    stock.updatePromotionStockInfo(productName, productQuantity);

    // then
    const updatedStockInfo = stock.getStockInfo();
    const promotionStock = updatedStockInfo.find(item => item.name === productName && item.promotion === '탄산2+1');
    const generalStock = updatedStockInfo.find(item => item.name === productName && item.promotion === null);

    expect(promotionStock.quantity).toBe(0);
    expect(generalStock.quantity).toBe(5);
  });

  test('updateGeneralStockInfo(): 프로모션 미적용 상품에 대한 일반 재고를 차감한다.', () => {
    // given
    const productName = '에너지바';
    const productQuantity = 2;

    // when
    stock.updateGeneralStockInfo(productName, productQuantity);

    // then
    const updatedStockInfo = stock.getStockInfo();
    const generalStock = updatedStockInfo.find(item => item.name === productName && item.promotion === null);

    expect(generalStock.quantity).toBe(3);
  });
});
