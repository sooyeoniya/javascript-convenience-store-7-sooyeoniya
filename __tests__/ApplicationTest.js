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

  // test('여러 개의 일반 상품 구매', async () => {
  //   await run({
  //     inputs: ['[비타민워터-3],[물-2],[정식도시락-2]', 'N', 'N'],
  //     expectedIgnoringWhiteSpaces: ['내실돈18,300'],
  //   });
  // });

  // test('기간에 해당하지 않는 프로모션 적용', async () => {
  //   mockNowDate('2024-02-01');

  //   await run({
  //     inputs: ['[감자칩-2]', 'N', 'N'],
  //     expectedIgnoringWhiteSpaces: ['내실돈3,000'],
  //   });
  // });

  it.each([
    ['빈 값인 경우', ['[-],[-]', 'N', 'N'], ERROR_MESSAGES.INPUT_FORM],
    ['대괄호([]) 없는 경우', ['탄산수-3', 'N', 'N'], ERROR_MESSAGES.INPUT_FORM],
    ['하이픈(-) 없는 경우', ['[비타민워터5]', 'N', 'N'], ERROR_MESSAGES.INPUT_FORM],
    ['수량이 문자인 경우', ['[컵라면-주세요]', 'N', 'N'], ERROR_MESSAGES.INPUT_FORM],
    ['공백이 포함된 경우', ['[ 감자칩 - 4 ]', 'N', 'N'], ERROR_MESSAGES.INPUT_FORM],
    ['중복된 상품명이 존재하는 경우', ['[사이다-1],[사이다-2]', 'N', 'N'], ERROR_MESSAGES.DUPLICATE_PRODUCTS_NAME],
    ['수량이 0인 경우', ['[사이다-0]', 'N', 'N'], ERROR_MESSAGES.QUANTITY_IS_LESS_THAN_ZERO],
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
