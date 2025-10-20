export default class Calculator {
  static MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
  static MAX_DIGITS = 16;

  /**
   * 문자열을 받아서 합계를 계산한다.
   * @param {string} input
   * @returns {number}
   */
  static calculate(input) {
    const numbers = this.tokenize(input); // step3에서 구현
    let sum = 0;
    for (const num of numbers) {
      if (sum + num > this.MAX_SAFE_INTEGER) {
        throw new Error('[ERROR] 합계가 허용 범위를 초과했습니다.');
      }
      sum += num;
    }
    return sum;
  }

  /**
   * 문자열을 구분자 기준으로 분리하여 숫자 배열 반환
   * @param {string} input
   * @returns {number[]}
   */
  static tokenize(input) {
    // 입력 체크
    if (input === null || input === undefined || typeof input !== 'string') {
      throw new Error('[ERROR] 입력 값이 존재하지 않거나 문자열이 아닙니다.');
    }
    if (input === '') return [];

    if (/[\x00-\x1F]/.test(input)) {
      throw new Error('[ERROR] 입력에 허용되지 않는 제어 문자가 포함되어 있습니다.');
    }

    // 기본 구분자
    let delimiters = [',', ':'];
    let numbersPart = input;

    // 커스텀 구분자 처리
    if (input.startsWith('//')) {
      const customDelimiterMatch = input.match(/^\/\/(.?)\\n(.*)$/);
      if (!customDelimiterMatch) {
        throw new Error('[ERROR] 커스텀 구분자 형식이 잘못되었습니다.');
      }

      const [_, customDelimiter, rest] = customDelimiterMatch;

      if (!customDelimiter) {
        throw new Error('[ERROR] 커스텀 구분자를 지정해야 합니다.');
      }
      if (/^\d$/.test(customDelimiter)) {
        throw new Error('[ERROR] 커스텀 구분자는 숫자가 될 수 없습니다.');
      }
      if (/\s/.test(customDelimiter)) {
        throw new Error('[ERROR] 커스텀 구분자는 공백을 포함할 수 없습니다.');
      }

      delimiters.push(customDelimiter);
      numbersPart = rest;
    }

    const regex = new RegExp(`[${delimiters.join('')}]`);
    const tokens = numbersPart.split(regex);

    return tokens.map((token) => {
      const trimmed = token.trim();
      if (trimmed === '') {
        throw new Error('[ERROR] 구분자 사이에 숫자가 없습니다.');
      }
      if (!/^\d+$/.test(trimmed)) {
        throw new Error(`[ERROR] 숫자가 아닌 값이 포함되어 있습니다: "${token}"`);
      }
      if (trimmed.length > this.MAX_DIGITS) {
        throw new Error(`[ERROR] 숫자 값이 허용 범위를 초과했습니다: "${token}"`);
      }

      const num = Number(trimmed);
      if (!Number.isSafeInteger(num)) {
        throw new Error(`[ERROR] 숫자 값이 허용 범위를 초과했습니다: "${token}"`);
      }
      return num;
    });
  }
}
