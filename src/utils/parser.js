
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
  return string.split(',').map((item) => item.trim());
}

/**
 * [ '[콜라-10]', '[사이다-3]' ]
 * -> [ { name: '콜라', quantity: 10 }, { name: '사이다', quantity: 3 } ]
 * @param {Array<string>} productsDetails 
 * @returns {Array<{ name: string, quantity: number }>}
 */
const parseProductsDetails = (productsDetails) => {
  return productsDetails.map((productDetails) => {
    const productInfo = productDetails.slice(1, -1).split('-').map((item) => item.trim());

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

const parser = {
  parseThousandComma,
  parseStringToArray,
  parseProductsDetails,
  parseToUpperCase,
}

export default parser;
