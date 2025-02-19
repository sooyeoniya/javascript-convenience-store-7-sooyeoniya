import App from '../src/App.js';
import { MissionUtils } from '@woowacourse/mission-utils';
import { EOL as LINE_SEPARATOR } from 'os';
import { ERROR_MESSAGES } from '../src/constants/constants.js';
import mockNowDate from '../src/utils/mockNowDate.js';

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

  test('여러 개의 일반 상품 구매', async () => {
    await run({
      inputs: ['[비타민워터-3],[물-2],[정식도시락-2]', 'N', 'N'],
      expectedIgnoringWhiteSpaces: ['내실돈18,300'],
    });
  });

  test('기간에 해당하지 않는 프로모션 적용', async () => {
    mockNowDate('2024-02-01');

    await run({
      inputs: ['[감자칩-2]', 'N', 'N'],
      expectedIgnoringWhiteSpaces: ['내실돈3,000'],
    });
  });

  test('프로모션 기간에 해당하지 않는 상품 재고 수량 초과', async () => {
    mockNowDate('2024-02-01');

    await runExceptions({
      inputs: ['[감자칩-6]', 'N', 'N'],
      inputsToTerminate: INPUTS_TO_TERMINATE,
      expectedErrorMessage: ERROR_MESSAGES.EXCEEDED_QUANTITY,
    });
  });

  test('과제 실행 결과 예시 테스트 케이스', async () => {
    await run({
      inputs: [
        '[콜라-3],[에너지바-5]', 'Y', 'Y',
        '[콜라-10]', 'Y', 'N', 'Y',
        '[오렌지주스-1]', 'Y', 'Y', 'N',
      ],
      expectedIgnoringWhiteSpaces: [
        '총구매액813,000', '행사할인-1,000', '멤버십할인-3,000', '내실돈9,000',
        '총구매액1010,000', '행사할인-2,000', '멤버십할인-0', '내실돈8,000',
        '총구매액23,600', '행사할인-1,800', '멤버십할인-0', '내실돈1,800',
      ],
    });
  });

  test.each([
    ['입력 형식 오류 (1)', ['[컵라면-12', 'N', 'N'], ERROR_MESSAGES.INVALID_FORMAT],
    ['입력 형식 오류 (2)', ['컵라면-12]', 'N', 'N'], ERROR_MESSAGES.INVALID_FORMAT],
    ['입력 형식 오류 (3)', ['[컵라면12]', 'N', 'N'], ERROR_MESSAGES.INVALID_FORMAT],
    ['입력 형식 오류 (4)', ['[컵라면-3개]', 'N', 'N'], ERROR_MESSAGES.INVALID_FORMAT],
    ['입력 형식 오류 (5)', ['[컵-라-면-3]', 'N', 'N'], ERROR_MESSAGES.INVALID_FORMAT],
    ['입력 형식 오류 (6)', ['[컵[라]면-3]', 'N', 'N'], ERROR_MESSAGES.INVALID_FORMAT],
    ['입력 형식 오류 (7)', ['[컵라면--3]', 'N', 'N'], ERROR_MESSAGES.INVALID_FORMAT],
    ['입력 형식 오류 (8)', ['[컵라면-3.5]', 'N', 'N'], ERROR_MESSAGES.INVALID_FORMAT],
    ['존재하지 않는 상품', ['[없는상품-12]', 'N', 'N'], ERROR_MESSAGES.NON_EXISTENT],
    ['재고 수량 초과', ['[컵라면-12]', 'N', 'N'], ERROR_MESSAGES.EXCEEDED_QUANTITY],
  ])('예외 테스트: %s', async (_, input, errorMessage) => {
    await runExceptions({
      inputs: input,
      inputsToTerminate: INPUTS_TO_TERMINATE,
      expectedErrorMessage: errorMessage,
    });
  });
});
