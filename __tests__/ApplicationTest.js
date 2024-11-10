import App from '../src/App.js';
import { MissionUtils } from '@woowacourse/mission-utils';
import { EOL as LINE_SEPARATOR } from 'os';
import { ERROR_MESSAGES } from '../src/constants/constants.js';

const mockQuestions = (inputs) => {
  const messages = [];

  MissionUtils.Console.readLineAsync = jest.fn((prompt) => {
    messages.push(prompt);
    const input = inputs.shift();

    if (input === undefined) {
      throw new Error('NO INPUT');
    }

    return Promise.resolve(input);
  });

  MissionUtils.Console.readLineAsync.messages = messages;
};

const mockNowDate = (date = null) => {
  const mockDateTimes = jest.spyOn(MissionUtils.DateTimes, 'now');
  mockDateTimes.mockReturnValue(new Date(date));
  return mockDateTimes;
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, 'print');
  logSpy.mockClear();
  return logSpy;
};

const getOutput = (logSpy) => {
  return [...logSpy.mock.calls].join(LINE_SEPARATOR);
};

const expectLogContains = (received, expects) => {
  expects.forEach((exp) => {
    expect(received).toContain(exp);
  });
};

const expectLogContainsWithoutSpacesAndEquals = (received, expects) => {
  const processedReceived = received.replace(/[\s=]/g, '');
  expects.forEach((exp) => {
    expect(processedReceived).toContain(exp);
  });
};

const runExceptions = async ({
  inputs = [],
  inputsToTerminate = [],
  expectedErrorMessage = '',
}) => {
  // given
  const logSpy = getLogSpy();
  mockQuestions([...inputs, ...inputsToTerminate]);

  // when
  const app = new App();
  await app.run();

  // then
  expect(logSpy).toHaveBeenCalledWith(
    expect.stringContaining(expectedErrorMessage)
  );
};

const run = async ({
  inputs = [],
  inputsToTerminate = [],
  expected = [],
  expectedIgnoringWhiteSpaces = [],
}) => {
  // given
  const logSpy = getLogSpy();
  mockQuestions([...inputs, ...inputsToTerminate]);

  // when
  const app = new App();
  await app.run();

  const output = getOutput(logSpy);

  // then
  if (expectedIgnoringWhiteSpaces.length > 0) {
    expectLogContainsWithoutSpacesAndEquals(
      output,
      expectedIgnoringWhiteSpaces
    );
  }
  if (expected.length > 0) {
    expectLogContains(output, expected);
  }
};

const INPUTS_TO_TERMINATE = ['[비타민워터-1]', 'N', 'N'];

describe('편의점', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('파일에 있는 상품 목록 출력', async () => {
    await run({
      inputs: ['[콜라-1]', 'N', 'N'],
      expected: [
        /* prettier-ignore */
        '- 콜라 1,000원 10개 탄산2+1',
        '- 콜라 1,000원 10개',
        '- 사이다 1,000원 8개 탄산2+1',
        '- 사이다 1,000원 7개',
        '- 오렌지주스 1,800원 9개 MD추천상품',
        '- 오렌지주스 1,800원 재고 없음',
        '- 탄산수 1,200원 5개 탄산2+1',
        '- 탄산수 1,200원 재고 없음',
        '- 물 500원 10개',
        '- 비타민워터 1,500원 6개',
        '- 감자칩 1,500원 5개 반짝할인',
        '- 감자칩 1,500원 5개',
        '- 초코바 1,200원 5개 MD추천상품',
        '- 초코바 1,200원 5개',
        '- 에너지바 2,000원 5개',
        '- 정식도시락 6,400원 8개',
        '- 컵라면 1,700원 1개 MD추천상품',
        '- 컵라면 1,700원 10개',
      ],
    });
  });

  // 기존 테스트 코드
  test("여러 개의 일반 상품 구매", async () => {
    await run({
      inputs: ["[비타민워터-3],[물-2],[정식도시락-2]", "N", "N"],
      expectedIgnoringWhiteSpaces: ["내실돈18,300"],
    });
  });

  test("기간에 해당하지 않는 프로모션 적용", async () => {
    mockNowDate("2024-02-01");

    await run({
      inputs: ["[감자칩-2]", "N", "N"],
      expectedIgnoringWhiteSpaces: ["내실돈3,000"],
    });
  });

  test("예외 테스트", async () => {
    await runExceptions({
      inputs: ["[컵라면-12]", "N", "N"],
      inputsToTerminate: INPUTS_TO_TERMINATE,
      expectedErrorMessage:
        "[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.",
    });
  });

  it.each([
    [
      '감자칩 반짝할인', 
      // 멤버십 할인: N, 추가 구매: N
      ['[감자칩-2]', 'N', 'N'], 
      ['감자칩23,000', '총구매액23,000', '행사할인-0', '멤버십할인-0', '내실돈3,000'],
    ],
    [
      '콜라 2+1', 
      // 멤버십 할인: Y, 추가 구매: N
      ['[콜라-5]', 'Y', 'N'], 
      ['콜라55,000', '총구매액55,000', '행사할인-0', '멤버십할인-1,500', '내실돈3,500'],
    ],
    [
      '일반 재고 없는 오렌지주스와 탄산수 호출(에러 발생 후 다시 입력 받음), 컵라면 MD추천상품', 
      // 멤버십 할인: Y, 추가 구매: N
      ['[오렌지주스-3]', '[탄산수-2]', '[컵라면-4]', 'Y', 'N'], 
      ['컵라면46,800', '총구매액46,800', '행사할인-0', '멤버십할인-2,040', '내실돈4,760'],
    ],
  ])('기간에 해당하지 않는 프로모션 적용: %s', async (_, inputs, expectedOutput) => {
    mockNowDate('2025-01-01');

    await run({
      inputs: inputs,
      expectedIgnoringWhiteSpaces: expectedOutput,
    });
  });

  it.each([
    [
      '여러 개의 일반 상품 구매하는 경우', 
      // 멤버십 할인: N, 추가 구매: N
      ['[비타민워터-3],[물-2],[정식도시락-2]', 'N', 'N'], 
      ['비타민워터34,500', '물21,000', '정식도시락212,800', '총구매액718,300', '행사할인-0', '멤버십할인-0', '내실돈18,300'],
    ],
    [
      '4주차 과제에 올라온 실행 결과 예시',
      [
        // 멤버십 할인: Y, 추가 구매: Y
        '[콜라-3],[에너지바-5]', 'Y', 'Y', 
        // 프로모션 미적용 구매: Y, 멤버십 할인: N, 추가 구매: Y
        '[콜라-10]', 'Y', 'N', 'Y', 
        // 프로모션 혜택 상품 추가: Y, 멤버십 할인: Y, 추가 구매: N
        '[오렌지주스-1]', 'Y', 'Y', 'N'], 
      [
        '콜라33,000', '에너지바510,000', '콜라1', '총구매액813,000', '행사할인-1,000', '멤버십할인-3,000', '내실돈9,000',
        '콜라1010,000', '콜라2', '총구매액1010,000', '행사할인-2,000', '멤버십할인-0', '내실돈8,000',
        '오렌지주스23,600', '오렌지주스1', '총구매액23,600', '행사할인-1,800', '멤버십할인-0', '내실돈1,800'
      ],
    ],
    [
      '멤버십 할인 금액이 8,000원 초과하는 경우',
      // 멤버십 할인: Y, 추가 구매: N
      ['[물-10],[정식도시락-8],[에너지바-5]', 'Y', 'N'],
      ['물105,000', '정식도시락851,200', '에너지바510,000', '총구매액2366,200', '행사할인-0', '멤버십할인-8,000', '내실돈58,200'],
    ],
    [
      '프로모션 혜택 상품에 대해 상품 수량 추가하는 경우',
      // 프로모션 혜택 상품 추가 2개: Y, 멤버십 할인: Y, 추가 구매: N
      ['[사이다-2],[감자칩-1]', 'Y', 'Y', 'Y', 'N'],
      ['사이다33,000', '감자칩23,000', '사이다1', '감자칩1', '총구매액56,000', '행사할인-2,500', '멤버십할인-0', '내실돈3,500'],
    ],
    [
      '프로모션 혜택 상품에 대해 상품 수량 추가하지 않는 경우',
      // 프로모션 혜택 상품 추가 2개: N, 멤버십 할인: Y, 추가 구매: N
      ['[사이다-2],[감자칩-1]', 'N', 'N', 'Y', 'N'],
      ['사이다22,000', '감자칩11,500', '총구매액33,500', '행사할인-0', '멤버십할인-1,050', '내실돈2,450'],
    ],
    [
      '프로모션 기간 중인 상품의 프로모션 재고보다 같거나 많은 수량을 선택했지만 프로모션 혜택 미적용 상품에 대해 구매하는 경우',
      // 프로모션 미적용 구매 3개: Y, 멤버십 할인: Y, 추가 구매: N
      ['[콜라-11],[탄산수-5],[감자칩-7]', 'Y', 'Y', 'Y', 'Y', 'N'],
      [
        '콜라1111,000', '탄산수56,000', '감자칩710,500', 
        '콜라3', '탄산수1', '감자칩2', 
        '총구매액2327,500', '행사할인-7,200', '멤버십할인-2,670', '내실돈17,630',
      ],
    ],
    [
      '프로모션 기간 중인 상품의 프로모션 재고보다 같거나 많은 수량을 선택했지만 프로모션 혜택 미적용 상품에 대해 구매하지 않는 경우',
      // 프로모션 미적용 구매 3개: N, 멤버십 할인: Y, 추가 구매: N
      ['[콜라-11],[탄산수-5],[감자칩-7]', 'N', 'N', 'N', 'Y', 'N'],
      [
        '콜라99,000', '탄산수33,600', '감자칩46,000', 
        '콜라3', '탄산수1', '감자칩2', 
        '총구매액1618,600', '행사할인-7,200', '멤버십할인-0', '내실돈11,400',
      ],
    ],
  ])('%s', async (_, inputs, expectedOutput) => {
    await run({
      inputs: inputs,
      expectedIgnoringWhiteSpaces: expectedOutput,
    });
  });

  it.each([
    ['빈 값인 경우', ['[-],[-]', 'N', 'N'], ERROR_MESSAGES.INPUT_FORM],
    ['대괄호([]) 없는 경우', ['탄산수-3', 'N', 'N'], ERROR_MESSAGES.INPUT_FORM],
    ['하이픈(-) 없는 경우', ['[비타민워터5]', 'N', 'N'], ERROR_MESSAGES.INPUT_FORM],
    ['수량이 문자인 경우', ['[컵라면-주세요]', 'N', 'N'], ERROR_MESSAGES.INPUT_FORM],
    ['공백이 포함된 경우', ['[ 감자칩 - 4 ]', 'N', 'N'], ERROR_MESSAGES.INPUT_FORM],
    ['중복된 상품명이 존재하는 경우', ['[사이다-1],[사이다-2]', 'N', 'N'], ERROR_MESSAGES.OTHER_ERRORS],
    ['수량이 0인 경우', ['[사이다-0]', 'N', 'N'], ERROR_MESSAGES.OTHER_ERRORS],
    ['존재하지 않는 상품인 경우', ['[정식도시락-1],[없는상품-2],[컵라면-3]', 'N', 'N'], ERROR_MESSAGES.NOT_EXIST],
    ['수량이 재고보다 초과된 경우', ['[감자칩-2],[컵라면-12]', 'N', 'N'], ERROR_MESSAGES.QUANTITY_IS_OVER_STOCK],
  ])('예외 테스트: %s', async (_, inputs) => {
    await runExceptions({
      inputs: inputs,
      inputsToTerminate: INPUTS_TO_TERMINATE,
      expectedErrorMessage: ERROR_MESSAGES.INPUT_FORM,
    });
  });
});
