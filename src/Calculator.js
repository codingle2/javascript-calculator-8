export default class Calculator {
  static MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
  static MAX_DIGITS = 16;

  static calculate(input) {
    // 1단계~6단계 순서대로 처리
    this.validateInput(input);

    const numbersPart = this.extractNumbersPart(input);
    const tokens = this.tokenize(numbersPart, input);
    const numbers = this.validateTokens(tokens);
    return this.sumNumbers(numbers);
  }

  // step1,6: 입력 존재 / 타입 / 보안 검증
  static validateInput(input) {
    if (input === '') return '0';
    if (input === null || input === undefined || typeof input !== 'string') {
      throw new Error('[ERROR] 입력 값이 존재하지 않거나 문자열이 아닙니다.');
    }
    
    if (input.includes('\0')) {
      throw new Error('[ERROR] 널 바이트가 포함되어 있습니다.');
    }
    if (/[\x00-\x1F]/.test(input)) {
      throw new Error('[ERROR] 입력에 허용되지 않는 제어 문자가 포함되어 있습니다.');
    }
    if (/[^\x20-\x7E\uAC00-\uD7AF\u3130-\u318F]/.test(input)) {
      throw new Error('[ERROR] 지원되지 않는 문자 인코딩입니다.');
    }
  }

  // step2: 구분자 처리
  static extractNumbersPart(input) {
    let delimiters = [',', ':'];
    let numbersPart = input;
    if (input.startsWith('//')) {
      const customDelimiterMatch = input.match(/^\/\/(.?)\\n(.*)$/);
      if (!customDelimiterMatch) throw new Error('[ERROR] 커스텀 구분자 형식이 잘못되었습니다.');
      const [, customDelimiter, rest] = customDelimiterMatch;
      if (!customDelimiter) throw new Error('[ERROR] 커스텀 구분자를 지정해야 합니다.');
      if (/^\d$/.test(customDelimiter)) throw new Error('[ERROR] 커스텀 구분자는 숫자가 될 수 없습니다.');
      if (/\s/.test(customDelimiter)) throw new Error('[ERROR] 커스텀 구분자는 공백을 포함할 수 없습니다.');
      delimiters.push(customDelimiter);
      numbersPart = rest;
    }
    return { numbersPart, delimiters };
  }

  // step3: 토큰화
  static tokenize({ numbersPart, delimiters }) {
    // numbersPart가 비어있으면 빈 배열을 반환
    if (numbersPart === '') return [];
    const regex = new RegExp(`[${delimiters.join('')}]`);
    return numbersPart.split(regex).map(t => t.trim());
  }

  // step4~5: 토큰 단위 유효성 검사
  static validateTokens(tokens) {
    return tokens.map((token) => {
      if (token === '') throw new Error('[ERROR] 구분자 사이에 숫자가 없습니다.');
      if (!/^\d+$/.test(token)) {
        if (/^-/.test(token)) throw new Error(`[ERROR] 음수는 허용되지 않습니다: ${token}`);
        if (/^\d*\.\d+$/.test(token)) throw new Error(`[ERROR] 소수(실수)는 허용되지 않습니다: ${token}`);
        throw new Error(`[ERROR] 숫자가 아닌 값이 포함되어 있습니다: ${token}`);
      }
      if (token.length > this.MAX_DIGITS) throw new Error(`[ERROR] 숫자 값이 허용 범위를 초과했습니다: ${token}`);
      const num = Number(token);
      if (!Number.isSafeInteger(num)) throw new Error(`[ERROR] 숫자 값이 허용 범위를 초과했습니다: ${token}`);
      return num;
    });
  }

  // 합계 계산
  static sumNumbers(numbers) {
    let sum = 0;
    for (const num of numbers) {
      if (sum + num > this.MAX_SAFE_INTEGER) {
        throw new Error('[ERROR] 합계가 허용 범위를 초과했습니다.');
      }
      sum += num;
    }
    return sum;
  }
}