import { CONFIRMATION_RESPONSES } from '../src/constants/constants.js';
import getUserConfirmation from '../src/utils/getUserConfirmation.js';
import ReceiptService from '../src/service/ReceiptService.js';

jest.mock('../src/utils/getUserConfirmation.js');

describe('ReceiptService 클래스 테스트', () => {
  let receiptService, productManagementService, stock, promotion;

  beforeEach(() => {
    // given
    stock = {
      getProductPrice: jest.fn().mockImplementation((productName) => {
        const prices = { '콜라': 1000, '오렌지주스': 1800, '에너지바': 2000 };
        return prices[productName];
      }),
      getPromotionName: jest.fn().mockImplementation((productName) => {
        const promotions = { '콜라': '탄산2+1', '오렌지주스': 'MD추천상품', '에너지바': null }
        return promotions[productName];
      }),
    };

    promotion = {
      getPromotionBuyPlusGetValue: jest.fn().mockImplementation((promotionName) => {
        const buyPlusGet = { '탄산2+1': 3, 'MD추천상품': 2 }
        return buyPlusGet[promotionName];
      }),
    }

    productManagementService = {
      getProductsInfo: jest.fn().mockReturnValue([
        { name: '콜라', quantity: 11, giftCount: 3 },
        { name: '오렌지주스', quantity: 4, giftCount: 2 },
        { name: '에너지바', quantity: 5, giftCount: 0 },
      ]),
    };

    receiptService = new ReceiptService(stock, promotion, productManagementService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('processReceipt(): 멤버십 할인 적용하는 경우에 대한 영수증 내역을 반환한다.', async () => {
    // given
    getUserConfirmation.mockResolvedValue(CONFIRMATION_RESPONSES.YES);

    // when
    const receipt = await receiptService.processReceipt();

    // then
    expect(receipt).toEqual({
      items: [
        { name: '콜라', quantity: 11, giftCount: 3, itemTotalAmount: 11000 },
        { name: '오렌지주스', quantity: 4, giftCount: 2, itemTotalAmount: 7200 },
        { name: '에너지바', quantity: 5, giftCount: 0, itemTotalAmount: 10000 },
      ],
      totalQuantity: 20,
      totalAmount: 28200,
      eventDiscount: 6600,
      membershipDiscount: 3600,
      finalAmount: 18000,
    });
  });

  test('processReceipt(): 멤버십 할인 적용하지 않는 경우에 대한 영수증 내역을 반환한다.', async () => {
    // given
    getUserConfirmation.mockResolvedValue(CONFIRMATION_RESPONSES.NO);

    // when
    const receipt = await receiptService.processReceipt();

    // then
    expect(receipt).toEqual({
      items: [
        { name: '콜라', quantity: 11, giftCount: 3, itemTotalAmount: 11000 },
        { name: '오렌지주스', quantity: 4, giftCount: 2, itemTotalAmount: 7200 },
        { name: '에너지바', quantity: 5, giftCount: 0, itemTotalAmount: 10000 },
      ],
      totalQuantity: 20,
      totalAmount: 28200,
      eventDiscount: 6600,
      membershipDiscount: 0,
      finalAmount: 21600,
    });
  });
});
