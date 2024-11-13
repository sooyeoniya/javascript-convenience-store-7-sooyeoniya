import Promotion from '../src/domain/Promotion.js';
import readFileData from '../src/utils/readFileData.js';

jest.mock('../src/utils/readFileData.js');

describe('Promotion 클래스 테스트', () => {
  let promotion;

  beforeEach(() => {
    // given
    readFileData.mockReturnValue([
      '탄산2+1,2,1,2024-01-01,2024-12-31',
      'MD추천상품,1,1,2024-01-01,2024-12-31',
      '반짝할인,1,1,2024-11-01,2024-11-30',
    ]);
    promotion = new Promotion();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getPromotionInfo(): 초기화된 프로모션 전체 정보를 반환한다.', () => {
    // given: 프로모션 이름
    // when
    const promotionInfo = promotion.getPromotionInfo();

    // then
    expect(promotionInfo).toEqual([
      { name: '탄산2+1', buy: 2, get: 1, startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), isAvailable: true },
      { name: 'MD추천상품', buy: 1, get: 1, startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), isAvailable: true },
      { name: '반짝할인', buy: 1, get: 1, startDate: new Date('2024-11-01'), endDate: new Date('2024-11-30'), isAvailable: true },
    ]);
  });

  test('getPromotionBuyValue(): 해당하는 프로모션에 대한 buy 값을 반환한다.', () => {
    // given: 프로모션 이름
    // when
    const carbonatedTwoPlusOneBuyValue = promotion.getPromotionBuyValue('탄산2+1');
    const MDRecommendedProductBuyValue = promotion.getPromotionBuyValue('MD추천상품');
    const flashSaleBuyValue = promotion.getPromotionBuyValue('반짝할인');

    // then
    expect(carbonatedTwoPlusOneBuyValue).toBe(2);
    expect(MDRecommendedProductBuyValue).toBe(1);
    expect(flashSaleBuyValue).toBe(1);
  });

  test('getPromotionGetValue(): 해당하는 프로모션에 대한 get 값을 반환한다.', () => {
    // given: 프로모션 이름
    // when
    const carbonatedTwoPlusOneGetValue = promotion.getPromotionGetValue('탄산2+1');
    const MDRecommendedProductGetValue = promotion.getPromotionGetValue('MD추천상품');
    const flashSaleGetValue = promotion.getPromotionGetValue('반짝할인');

    // then
    expect(carbonatedTwoPlusOneGetValue).toBe(1);
    expect(MDRecommendedProductGetValue).toBe(1);
    expect(flashSaleGetValue).toBe(1);
  });

  test('getPromotionBuyPlusGetValue(): 해당하는 프로모션에 대한 buy + get 값을 반환한다.', () => {
    // given: 프로모션 이름
    // when
    const carbonatedTwoPlusOneBuyPlusGetValue = promotion.getPromotionBuyPlusGetValue('탄산2+1');
    const MDRecommendedProductBuyPlusGetValue = promotion.getPromotionBuyPlusGetValue('MD추천상품');
    const flashSaleBuyPlusGetValue = promotion.getPromotionBuyPlusGetValue('반짝할인');

    // then
    expect(carbonatedTwoPlusOneBuyPlusGetValue).toBe(3);
    expect(MDRecommendedProductBuyPlusGetValue).toBe(2);
    expect(flashSaleBuyPlusGetValue).toBe(2);
  });
});
