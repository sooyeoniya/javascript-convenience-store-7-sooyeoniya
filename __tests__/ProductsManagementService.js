import ProductsManagementService from '../src/services/ProductsManagementService.js';
import getUserConfirm from '../src/utils/getUserConfirm.js';

jest.mock('../src/utils/getUserConfirm.js');

describe('ProductsManagementService 클래스 테스트', () => {
  // given
  let stock, promotion, productsManagementService;
  const productsInfo = [
    { name: '콜라', quantity: 10 },
    { name: '감자칩', quantity: 1 },
  ]

  beforeEach(() => {
    stock = {
      getPromotionName: jest.fn().mockImplementation((productName) => {
        const promotion = { '콜라': '탄산2+1', '감자칩': '반짝할인' };
        return promotion[productName];
      }),
      getPromotionStockQuantity: jest.fn().mockImplementation((productName) => {
        const quantity = { '콜라': 10, '감자칩': 5 };
        return quantity[productName];
      }),
      deductPromotionAndGeneralStockQuantity: jest.fn(),
      deductGeneralStockQuantity: jest.fn(),
    };

    promotion = {
      hasPromotion: jest.fn().mockReturnValue(true),
      getPromotionBuyPlusGet: jest.fn().mockImplementation((promotionName) => {
        const buyPlusGet = { '탄산2+1': 3, '반짝할인': 2 };
        return buyPlusGet[promotionName];
      }),
      getPromotionBuy: jest.fn().mockImplementation((promotionName) => {
        const buy = { '탄산2+1': 2, '반짝할인': 1 };
        return buy[promotionName];
      }),
      getPromotionGet: jest.fn().mockImplementation((promotionName) => {
        const get = { '탄산2+1': 1, '반짝할인': 1 };
        return get[promotionName];
      }),
    };

    productsManagementService = new ProductsManagementService(stock, promotion);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('manageProducts 및 getProductsInfo 메서드 테스트', () => {
    test('사용자가 구매할 상품에 대한 점검 및 재고 차감 로직을 실행하고 구매할 상품 정보를 반환한다.', async () => {
      // given
      getUserConfirm
        .mockResolvedValueOnce('N')  // 콜라 1개 정가 계산 안내 메시지에 대한 답변
        .mockResolvedValueOnce('Y'); // 감자칩 증정 수량 1개 추가 안내 메시지에 대한 답변
      
      // when
      await productsManagementService.manageProducts(productsInfo);
      const productInfo = productsManagementService.getProductsInfo();

      // then
      expect(productInfo).toEqual([
        { name: '콜라', quantity: 9, giftQuantity: 3 },
        { name: '감자칩', quantity: 2, giftQuantity: 1 },
      ]);
      expect(stock.deductPromotionAndGeneralStockQuantity).toHaveBeenCalledWith('콜라', 9);
      expect(stock.deductPromotionAndGeneralStockQuantity).toHaveBeenCalledWith('감자칩', 2);
    });
  });
});
