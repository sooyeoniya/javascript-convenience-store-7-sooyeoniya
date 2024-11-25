import Promotion from '../src/domains/Promotion.js';
import ReceiptService from '../src/services/ReceiptService.js';
import getUserConfirm from '../src/utils/getUserConfirm.js';

jest.mock('../src/utils/getUserConfirm.js');

describe('ReceiptService 클래스 테스트', () => {
  // given
  let stock, promotion, receiptService;
  const productsInfo = [
    { name: '콜라', quantity: 8, giftQuantity: 2 },
    { name: '감자칩', quantity: 2, giftQuantity: 1 },
  ];

  beforeEach(() => {
    stock = {
      getProductPrice: jest.fn().mockImplementation((productName) => {
        const price = { '콜라': 1000, '감자칩': 1500 };
        return price[productName];
      }),

      getPromotionName: jest.fn().mockImplementation((productName) => {
        const promotion = { '콜라': '탄산2+1', '감자칩': '반짝할인' };
        return promotion[productName];
      }),
    }
    promotion = new Promotion();
    receiptService = new ReceiptService(productsInfo, stock, promotion);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getReceiptInfo 메서드 테스트', () => {
    test('출력할 영수증 정보를 반환한다.', () => {
      // given
      const expectedReceiptInfo = {
        productsInfo: [
          { name: '콜라', quantity: 8, giftQuantity: 2 },
          { name: '감자칩', quantity: 2, giftQuantity: 1 },
        ],
        totalQuantity: 0,
        totalProductsAmount: 0,
        promotionDiscount: 0,
        membershipDiscount: 0,
        totalPaymentAmount: 0,
      };

      // when
      const receiptInfo = receiptService.getReceiptInfo();

      // then
      expect(receiptInfo).toEqual(expectedReceiptInfo);
    });
  });

  describe('calculateReceipt 메서드 테스트', () => {
    test('출력할 영수증 정보를 계산 후 갱신한다.', async () => {
      // given
      const expectedReceiptInfo = {
        productsInfo: [
          { name: '콜라', quantity: 8, giftQuantity: 2, totalPrice: 8000 },
          { name: '감자칩', quantity: 2, giftQuantity: 1, totalPrice: 3000 },
        ],
        totalQuantity: 10,
        totalProductsAmount: 11000,
        promotionDiscount: 3500,
        membershipDiscount: 600,
        totalPaymentAmount: 6900,
      };

      // 멤버십 할인 적용
      getUserConfirm.mockResolvedValue('Y'); // 비동기 반환에는 mockResolvedValue 사용

      // when
      await receiptService.calculateReceipt();
      const receiptInfo = receiptService.getReceiptInfo();

      // then
      expect(receiptInfo).toEqual(expectedReceiptInfo);

      // #setReceiptDetails()와 #getPromotionAmount()에서 각 상품마다 한 번씩 호출
      expect(stock.getProductPrice).toHaveBeenCalledTimes(4);
      expect(stock.getProductPrice).toHaveBeenCalledWith('콜라');
      expect(stock.getProductPrice).toHaveBeenCalledWith('감자칩');
    });
  });
});
