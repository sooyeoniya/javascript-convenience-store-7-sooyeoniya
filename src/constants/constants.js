export const ZERO = 0;
export const NULL = 'null';
export const NO_STOCK = '재고 없음';

export const FILE_PATH = Object.freeze({
  PRODUCTS: 'public/products.md',
  PROMOTIONS: 'public/promotions.md',
});

export const SPLIT = Object.freeze({
  COMMA: ',',
  DASH: '-',
  NEWLINE: '\n',
});

export const MEMBERSHIP_CALCULATION = Object.freeze({
  RATE: 0.3,
  MAX_NUM: 8_000,
});

export const USER_ANSWER = Object.freeze({
  YES: 'Y',
  NO: 'N',
});

export const PROMPT_MESSAGES = Object.freeze({
  WELCOME_GREETING: '\n안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n',
  PRODUCTS_DETAILS: '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
  ADDITIONAL_QUANTITY: (productName, get) => `\n현재 ${productName}은(는) ${get}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
  FULL_PRICE: (productName, fullPricePaymentForSomeQuantities) => `\n현재 ${productName} ${fullPricePaymentForSomeQuantities}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
  MEMBERSHIP_DISCOUNT: '\n멤버십 할인을 받으시겠습니까? (Y/N)\n',
  ADDITIONAL_PURCHASE: '\n감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n',
});

export const ERROR_MESSAGES = Object.freeze({
  INVALID_FORMAT: '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
  NON_EXISTENT: '[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.',
  EXCEEDED_QUANTITY: '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
  OTHERS: '[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.',
});
