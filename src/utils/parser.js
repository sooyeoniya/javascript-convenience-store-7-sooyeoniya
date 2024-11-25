import { SPLIT } from '../constants/constants.js';

/**
 * 숫자에 천 단위 콤마를 붙여 반환한다.
 * @param {number} number 
 * @returns {string}
 */
const parseThousandComma = (number) => {
  return number.toLocaleString('ko-KR');
}

/**
 * `[콜라-10],[사이다-3]` -> [ '[콜라-10]', '[사이다-3]' ]
 * @param {string} string
 * @returns {Array<string>}
 */
const parseStringToArray = (string) => {
  return string.split(SPLIT.COMMA).map((item) => item.trim());
}

/**
 * [ '[콜라-10]', '[사이다-3]' ]
 * -> [ { name: '콜라', quantity: 10 }, { name: '사이다', quantity: 3 } ]
 * @param {Array<string>} productsDetails 
 * @returns {Array<{ name: string, quantity: number }>}
 */
const parseProductsDetails = (productsDetails) => {
  const PREFIX_BRACEKET_INDEX = 1;  // '['
  const SUFFIX_BRACEKET_INDEX = -1; // ']'
  return productsDetails.map((productDetails) => {
    const productInfo = productDetails
    .slice(PREFIX_BRACEKET_INDEX, SUFFIX_BRACEKET_INDEX)
    .split(SPLIT.DASH)
    .map((item) => item.trim());

    return { name: productInfo[0], quantity: Number(productInfo[1]) };
  });
}

/**
 * string을 대문자로 반환
 * @param {string} string 
 * @returns {string}
 */
const parseToUpperCase = (string) => {
  return string.toUpperCase();
}

/**
 * 문자열 길이가 4 이상인 경우 tab 한 개, 4 미만인 경우 tab 두 개를 접미사에 붙여서 반환
 * @param {string} string 
 * @returns {string}
 */
const adjustTabsByLetterLength = (string) => {
  const CRITERIA_NUM = 4;
  if (string.length < CRITERIA_NUM) return `${string}\t\t`;
  return `${string}\t`;
}

const parser = {
  parseThousandComma,
  parseStringToArray,
  parseProductsDetails,
  parseToUpperCase,
  adjustTabsByLetterLength,
}

export default parser;
