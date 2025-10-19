export default class Calculator {
  /**
   * 문자열을 받아서 합계를 계산한다.
   * @param {string} input
   * @returns {number}
   */
  static calculate(input) {
    if (!input) return 0;

    let delimiters = [',', ':'];
    let numbersPart = input;

    // 커스텀 구분자 처리 (CRLF/LF 대응)
    const customDelimiterMatch = input.match(/^\/\/(.)\\n(.*)$/); // \n을 \\n으로 변경
    if (customDelimiterMatch) {
      delimiters.push(customDelimiterMatch[1]);
      numbersPart = customDelimiterMatch[2];
    }

    // 구분자 기준으로 숫자 분리
    const regex = new RegExp(`[${delimiters.join('')}]`);
    const tokens = numbersPart.split(regex);

    const numbers = tokens.map((token) => {
      if (token.trim() === '') {
        throw new Error('[ERROR] 구분자 사이에 숫자가 없습니다.');
      }
      const num = Number(token);
      if (Number.isNaN(num)) {
        throw new Error(`[ERROR] 숫자가 아닌 값이 포함되어 있습니다: "${token}"`);
      }
      return num;
    });

    return numbers.reduce((acc, num) => acc + num, 0);
  }
}
