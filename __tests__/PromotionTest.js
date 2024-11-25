import Promotion from '../src/domains/Promotion.js';
import getFileData from '../src/utils/getFileData.js';
import mockNowDate from '../src/utils/mockNowDate.js';

jest.mock('../src/utils/getFileData.js');

describe('Promotion 클래스 테스트', () => {
  // given
  let promotion;
  const mockData = [
    '탄산2+1,2,1,2024-01-01,2024-12-31',
    'MD추천상품,1,1,2024-01-01,2024-12-31',
    '반짝할인,1,1,2024-11-01,2024-11-30',
  ];
  const carbonicAcidPromotionName = '탄산2+1';
  const MDRecommendPromotionName = 'MD추천상품';
  const flashDiscountPromotionName = '반짝할인';

  beforeEach(() => {
    getFileData.mockReturnValue(mockData);
    promotion = new Promotion();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get 메서드 테스트', () => {
    test('getPromotionBuy(): 해당 프로모션에 대한 buy 값을 반환한다.', () => {
      // given: promotionName
      // when
      const carbonicAcidBuy = promotion.getPromotionBuy(carbonicAcidPromotionName);
      const MDRecommendBuy = promotion.getPromotionBuy(MDRecommendPromotionName);
      const flashDiscountBuy = promotion.getPromotionBuy(flashDiscountPromotionName);

      // then
      expect(carbonicAcidBuy).toBe(2);
      expect(MDRecommendBuy).toBe(1);
      expect(flashDiscountBuy).toBe(1);
    });

    test('getPromotionGet(): 해당 프로모션에 대한 get 값을 반환한다.', () => {
      // given: promotionName
      // when
      const carbonicAcidGet = promotion.getPromotionGet(carbonicAcidPromotionName);
      const MDRecommendGet = promotion.getPromotionGet(MDRecommendPromotionName);
      const flashDiscountGet = promotion.getPromotionGet(flashDiscountPromotionName);

      // then
      expect(carbonicAcidGet).toBe(1);
      expect(MDRecommendGet).toBe(1);
      expect(flashDiscountGet).toBe(1);
    });

    test('getPromotionBuyPlusGet(): 해당 프로모션에 대한 buy + get 값을 반환한다.', () => {
      // given: promotionName
      // when
      const carbonicAcidBuyPlusGet = promotion.getPromotionBuyPlusGet(carbonicAcidPromotionName);
      const MDRecommendBuyPlusGet = promotion.getPromotionBuyPlusGet(MDRecommendPromotionName);
      const flashDiscountBuyPlusGet = promotion.getPromotionBuyPlusGet(flashDiscountPromotionName);

      // then
      expect(carbonicAcidBuyPlusGet).toBe(3);
      expect(MDRecommendBuyPlusGet).toBe(2);
      expect(flashDiscountBuyPlusGet).toBe(2);
    });
  });

  describe('hasPromotion 메서드 테스트', () => {
    test('hasPromotion(): 현재 해당 프로모션 기간인지 확인한다.', () => {
      // given: promotionName
      mockNowDate('2024-12-01');
      getFileData.mockReturnValue([ // 현재 기간이 아닌 프로모션은 저장되지 않음
        '탄산2+1,2,1,2024-01-01,2024-12-31',
        'MD추천상품,1,1,2024-01-01,2024-12-31',
      ]);
      const promotion = new Promotion();

      // when
      const carbonicAcidPromotionPeriod = promotion.hasPromotion(carbonicAcidPromotionName);
      const MDRecommendPromotionPeriod = promotion.hasPromotion(MDRecommendPromotionName);
      const flashDiscountPromotionPeriod = promotion.hasPromotion(flashDiscountPromotionName);

      // then
      expect(carbonicAcidPromotionPeriod).toBe(true);
      expect(MDRecommendPromotionPeriod).toBe(true);
      expect(flashDiscountPromotionPeriod).toBe(false);
    });
  });
});
