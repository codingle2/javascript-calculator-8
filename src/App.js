import { MissionUtils } from '@woowacourse/mission-utils';
import Calculator from "./Calculator.js";

const { Console } = MissionUtils;

export default class App {
  async run() {
    const input = await Console.readLineAsync('덧셈할 문자열을 입력해주세요.\n');

    // 계산
    const result = Calculator.calculate(input);

    // 출력
    Console.print(`결과 : ${result}`);
  }
}
