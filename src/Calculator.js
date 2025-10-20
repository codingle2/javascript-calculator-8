// src/Calculator.js
export default class Calculator {
  /**
   * 문자열을 받아서 합계를 계산한다.
   * @param {string} input
   * @returns {number}
   */
  static calculate(input) {
    const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
    const MAX_DIGITS = 16; // 토큰 단위 최대 자릿수

    // =========================
    // 입력 존재 / 타입 검증
    // =========================
    if (input === null || input === undefined || typeof input !== 'string') {
      throw new Error('[ERROR] 입력 값이 존재하지 않거나 문자열이 아닙니다.');
    }

    if (input === '') return 0;

    if (/[\x00-\x1F]/.test(input)) {
      throw new Error('[ERROR] 입력에 허용되지 않는 제어 문자가 포함되어 있습니다.');
    }

    // =========================
    // 구분자 처리
    // =========================
    let delimiters = [',', ':'];
    let numbersPart = input;

    const customDelimiterMatch = input.match(/^\/\/(.)\\n(.*)$/);
    if (customDelimiterMatch) {
      delimiters.push(customDelimiterMatch[1]);
      numbersPart = customDelimiterMatch[2];
    }

    const regex = new RegExp(`[${delimiters.join('')}]`);
    const tokens = numbersPart.split(regex);

    const numbers = tokens.map((token) => {
      const trimmed = token.trim();

      // 구분자 사이에 숫자가 없는 경우
      if (trimmed === '') {
        throw new Error('[ERROR] 구분자 사이에 숫자가 없습니다.');
      }

      // 숫자 형식 체크
      if (!/^\d+$/.test(trimmed)) {
        throw new Error(`[ERROR] 숫자가 아닌 값이 포함되어 있습니다: "${token}"`);
      }

      // 토큰 단위 최대 자릿수 초과
      if (trimmed.length > MAX_DIGITS) {
        throw new Error(`[ERROR] 숫자 값이 허용 범위를 초과했습니다: "${token}"`);
      }

      const num = Number(trimmed);

      // 결과 값 범위 체크
      if (!Number.isSafeInteger(num)) {
        throw new Error(`[ERROR] 숫자 값이 허용 범위를 초과했습니다: "${token}"`);
      }

      return num;
    });

    // =========================
    // 합계 계산 시 안전 범위 체크
    // =========================
    let sum = 0;
    for (const num of numbers) {
      if (sum + num > MAX_SAFE_INTEGER) {
        throw new Error('[ERROR] 합계가 허용 범위를 초과했습니다.');
      }
      sum += num;
    }

    return sum;
  }
}
