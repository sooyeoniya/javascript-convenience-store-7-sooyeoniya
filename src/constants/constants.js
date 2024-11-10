export const DELIMITER = ',';

export const PROMPT_MESSAGES = Object.freeze({
  WELCOME_GREETING: '\n안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n',
  PRODUCTS_INFO: '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
  MEMBERSHIP_DISCOUNT: '\n멤버십 할인을 받으시겠습니까? (Y/N)\n',
  ADDITIONAL_PURCHASE: '\n감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n',
});

export const ERROR_MESSAGES = Object.freeze({
  INPUT_FORM: '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
  USER_CONFIRM: '[ERROR] 잘못된 입력입니다. Y(y) 또는 N(n)을 입력해주세요.',
  NOT_EXIST: '[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.',
  DUPLICATE_PRODUCTS_NAME: '[ERROR] 중복된 상품명이 존재합니다. 다시 입력해 주세요.',
  QUANTITY_IS_LESS_THAN_ZERO: '[ERROR] 수량이 0 이하의 값입니다. 다시 입력해주세요.',
  QUANTITY_IS_OVER_STOCK: '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
});

export const RECEIPT_MESSAGES = Object.freeze({
  HEADER: '\n==============W 편의점================\n상품명\t\t수량\t\t금액\n',
  GIFT_LINE: '\n==============증     정===============\n',
  TOTAL_LINE: '\n======================================\n',
});

export const RECEIPT_LABELS = Object.freeze({
  TOTAL_PURCHASE_AMOUNT: '총구매액',
  EVENT_DISCOUNT: '행사할인',
  MEMBERSHIP_DISCOUNT: '멤버십할인',
  FINAL_AMOUNT: '내실돈',
});

export const STOCK_LABELS = Object.freeze({
  NULL: 'null',
  NO_STOCK: '재고 없음',
});

export const CONFIRMATION_RESPONSES = Object.freeze({
  YES: 'Y',
  NO: 'N',
});

export const MEMBERSHIP_DISCOUNT = Object.freeze({
  MAX_LIMIT: 8000,
  RATE: 0.3,
});
