import Stock from '../src/domains/Stock.js';
import getFileData from '../src/utils/getFileData.js';

jest.mock('../src/utils/getFileData.js');

describe('Stock 클래스 테스트', () => {
  // given
  let stock;
  const mockData = [
    '콜라,1000,10,탄산2+1',
    '콜라,1000,10,null',
    '사이다,1000,8,탄산2+1',
    '물,500,10,null',
  ];
  const cokeProductName = '콜라';
  const spriteProductName = '사이다';
  const waterProductName = '물';

  beforeEach(() => {
    getFileData.mockReturnValue(mockData);
    stock = new Stock();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get 메서드 테스트', () => {
    test('getStockInfo(): 재고 전체 정보를 반환한다.', () => {
      // when
      const stockInfo = stock.getStockInfo();

      // then
      expect(stockInfo).toEqual([
        { name: '콜라', price: 1000, quantity: 10, promotion: '탄산2+1' },
        { name: '콜라', price: 1000, quantity: 10, promotion: null },
        { name: '사이다', price: 1000, quantity: 8, promotion: '탄산2+1' },
        { name: '사이다', price: 1000, quantity: 0, promotion: null },
        { name: '물', price: 500, quantity: 10, promotion: null },
      ]);
    });

    test('getPromotionName(): 해당 상품에 대한 프로모션 정보를 반환한다.', () => {
      // when
      const cokePromotionName = stock.getPromotionName(cokeProductName);
      const spritePromotionName = stock.getPromotionName(spriteProductName);
      const waterPromotionName = stock.getPromotionName(waterProductName);

      // then
      expect(cokePromotionName).toEqual('탄산2+1');
      expect(spritePromotionName).toEqual('탄산2+1');
      expect(waterPromotionName).toBeNull();
    });

    test('getGeneralStockQuantity(): 해당 상품의 일반 재고 수량을 반환한다.', () => {
      // when
      const cokeGeneralStockQuantity = stock.getGeneralStockQuantity(cokeProductName);
      const spriteGeneralStockQuantity = stock.getGeneralStockQuantity(spriteProductName);
      const waterGeneralStockQuantity = stock.getGeneralStockQuantity(waterProductName);

      // then
      expect(cokeGeneralStockQuantity).toBe(10);
      expect(spriteGeneralStockQuantity).toBe(0);
      expect(waterGeneralStockQuantity).toBe(10);
    });

    test('getPromotionStockQuantity(): 해당 상품의 프로모션 재고 수량을 반환한다.', () => {
      // when
      const cokePromotionStockQuantity = stock.getPromotionStockQuantity(cokeProductName);
      const spritePromotionStockQuantity = stock.getPromotionStockQuantity(spriteProductName);
      const waterPromotionStockQuantity = stock.getPromotionStockQuantity(waterProductName);

      // then
      expect(cokePromotionStockQuantity).toBe(10);
      expect(spritePromotionStockQuantity).toBe(8);
      expect(waterPromotionStockQuantity).toBeUndefined();
    });

    test('getProductPrice(): 해당 상품의 가격을 반환한다.', () => {
      // when
      const cokePrice = stock.getProductPrice(cokeProductName);
      const spritePrice = stock.getProductPrice(spriteProductName);
      const waterPrice = stock.getProductPrice(waterProductName);

      // then
      expect(cokePrice).toBe(1000);
      expect(spritePrice).toBe(1000);
      expect(waterPrice).toBe(500);
    });
  });

  describe('check 메서드 테스트', () => {
    test('checkPromotionAndGeneralStockQuantity(): 프로모션 혜택 적용 상품에 대하여 (프로모션 + 일반) 재고 수량 초과하는지 확인한다.', () => {
      // given
      const exceededNum = 21;
      const safeNum = 11;

      // when
      const isExceed_yes = stock.checkPromotionAndGeneralStockQuantity(cokeProductName, exceededNum);
      const isExceed_no = stock.checkPromotionAndGeneralStockQuantity(cokeProductName, safeNum);

      // then
      expect(isExceed_yes).toBe(true);
      expect(isExceed_no).toBe(false);
    });

    test('checkGeneralStockQuantity(): 프로모션 혜택 미적용 상품에 대하여 일반 재고 수량 초과하는지 확인한다.', () => {
      // given
      const exceededNum = 11;
      const safeNum = 10;

      // when
      const isExceed_yes = stock.checkGeneralStockQuantity(waterProductName, exceededNum);
      const isExceed_no = stock.checkGeneralStockQuantity(waterProductName, safeNum);

      // then
      expect(isExceed_yes).toBe(true);
      expect(isExceed_no).toBe(false);
    });

    test('checkProductExists(): 존재하는 상품인지 확인한다.', () => {
      // given
      const nonExistentProductName = '없는상품';

      // when
      const isExist_yes = stock.checkProductExists(cokeProductName);
      const isExist_no = stock.checkProductExists(nonExistentProductName);

      // then
      expect(isExist_yes).toBe(true);
      expect(isExist_no).toBe(false);
    });
  });

  describe('deduct 메서드 테스트', () => {
    test('deductGeneralStockQuantity(): 프로모션 미적용 상품에 대하여 해당 상품을 구매할 수량만큼 일반 재고 수량에서 차감한다.', () => {
      // given
      const deductNum = 6;

      // when
      stock.deductGeneralStockQuantity(waterProductName, deductNum);
      const generalStockQuantity = stock.getGeneralStockQuantity(waterProductName);

      // then
      expect(generalStockQuantity).toBe(4);
    });

    test('deductPromotionAndGeneralStockQuantity(): 프로모션 적용 상품에 대하여 해당 상품을 구매할 수량만큼 프로모션 및 일반 재고 수량에서 차감한다.', () => {
      // given
      const deductNum = 12;

      // when
      stock.deductPromotionAndGeneralStockQuantity(cokeProductName, deductNum);
      const promotionStockQuantity = stock.getPromotionStockQuantity(cokeProductName);
      const generalStockQuantity = stock.getGeneralStockQuantity(cokeProductName);

      // then
      expect(promotionStockQuantity).toBe(0);
      expect(generalStockQuantity).toBe(8);
    });
  });
});
