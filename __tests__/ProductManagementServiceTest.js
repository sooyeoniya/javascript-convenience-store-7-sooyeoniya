import { CONFIRMATION_RESPONSES } from '../src/constants/constants.js';
import getUserConfirmation from '../src/utils/getUserConfirmation.js';
import ProductManagementService from '../src/service/ProductManagementService.js';

jest.mock('../src/utils/getUserConfirmation.js');

describe('ProductManagementService 클래스 테스트', () => {
  let productManagementService, stock, promotion;

  beforeEach(() => {
    // given
    stock = {
      getStockInfo: jest.fn().mockReturnValue([
        { name: '콜라', price: 1000, quantity: 10, promotion: '탄산2+1' },
        { name: '콜라', price: 1000, quantity: 10, promotion: null },
        { name: '오렌지주스', price: 1800, quantity: 9, promotion: 'MD추천상품' },
        { name: '오렌지주스', price: 1800, quantity: 0, promotion: null },
        { name: '에너지바', price: 2000, quantity: 5, promotion: null },
      ]),
      updateGeneralStockInfo: jest.fn(),
      getPromotionStockQuantity: jest.fn(),
      getPromotionName: jest.fn(),
      updatePromotionStockInfo: jest.fn(),
    };

    promotion = {
      getPromotionInfo: jest.fn().mockReturnValue([
        { name: '탄산2+1', buy: 2, get: 1, startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), isAvailable: true },
        { name: 'MD추천상품', buy: 1, get: 1, startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), isAvailable: true },
      ]),
      getPromotionBuyValue: jest.fn(),
      getPromotionGetValue: jest.fn(),
      getPromotionBuyPlusGetValue: jest.fn(),
    };

    productManagementService = new ProductManagementService(stock, promotion);
    productManagementService.initProductsInfo([
      { name: '콜라', quantity: 11 },
      { name: '오렌지주스', quantity: 3 },
      { name: '에너지바', quantity: 5 },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('initProductsInfo(): 구매할 상품 및 수량을 초기화한다.', () => {
    // given
    const newProductsInfo = [
      { name: '콜라', quantity: 8 },
      { name: '에너지바', quantity: 5 },
    ];

    // when
    productManagementService.initProductsInfo(newProductsInfo);

    // then
    const productsInfo = productManagementService.getProductsInfo();
    expect(productsInfo).toEqual(newProductsInfo);
  });

  test('getProductsInfo(): 구매할 상품 및 수량 전체 정보를 반환한다.', () => {
    // when
    const productsInfo = productManagementService.getProductsInfo();

    // then
    expect(productsInfo).toEqual([
      { name: '콜라', quantity: 11 },
      { name: '오렌지주스', quantity: 3 },
      { name: '에너지바', quantity: 5 },
    ]);
  });

  test('hasSufficientStock(): 재고 수량이 충분한지 확인한다.', () => {
    // given: 상품명, 구매할 수량
    // when
    const isSufficient = productManagementService.hasSufficientStock('콜라', 5);
    const isInsufficient = productManagementService.hasSufficientStock('콜라', 20);

    // then
    expect(isSufficient).toBe(true);
    expect(isInsufficient).toBe(false);
  });

  test('processProducts(): 프로모션 미적용 상품 처리', async () => {
    // given
    stock.updateGeneralStockInfo.mockImplementation();

    // when
    await productManagementService.processProducts();

    // then
    expect(stock.updateGeneralStockInfo).toHaveBeenCalledWith('에너지바', 5);
  });

  test('processProducts(): 프로모션 적용 상품 처리 - 충분한 재고가 있는 경우', async () => {
    // given
    stock.getPromotionName.mockReturnValue('MD추천상품');
    stock.getPromotionStockQuantity.mockReturnValue(9);
    promotion.getPromotionBuyValue.mockReturnValue(1);
    promotion.getPromotionGetValue.mockReturnValue(1);
    promotion.getPromotionBuyPlusGetValue.mockReturnValue(2);

    // 프로모션 혜택 적용 상품 추가 구매 안함 (N)
    getUserConfirmation.mockResolvedValue(CONFIRMATION_RESPONSES.NO);

    // when
    await productManagementService.processProducts();

    // then
    expect(stock.updatePromotionStockInfo).toHaveBeenCalledWith('오렌지주스', 3);
    expect(getUserConfirmation).toHaveBeenCalled();
  });

  test('processProducts(): 프로모션 적용 상품 처리 - 재고가 부족한 경우', async () => {
    // given
    stock.getPromotionName.mockReturnValue('탄산2+1');
    stock.getPromotionStockQuantity.mockReturnValue(10);
    promotion.getPromotionBuyValue.mockReturnValue(2);
    promotion.getPromotionGetValue.mockReturnValue(1);
    promotion.getPromotionBuyPlusGetValue.mockReturnValue(3);

    // 프로모션 재고 부족하여 프로모션 혜택 적용 안되는 수량이 있어도 구매함 (Y)
    getUserConfirmation.mockResolvedValue(CONFIRMATION_RESPONSES.YES);

    // when
    await productManagementService.processProducts();

    // then
    expect(stock.updatePromotionStockInfo).toHaveBeenCalledWith('콜라', 11);
    expect(getUserConfirmation).toHaveBeenCalled();
  });
});
