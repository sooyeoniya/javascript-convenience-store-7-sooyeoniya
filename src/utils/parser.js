
/**
 * 숫자에 천 단위 콤마를 붙여 반환한다.
 * @param {number} number 
 * @returns {string}
 */
const parseThousandComma = (number) => {
  return number.toLocaleString('ko-KR');
}

const parser = {
  parseThousandComma,
}

export default parser;
