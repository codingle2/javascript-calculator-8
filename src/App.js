import { MissionUtils } from '@woowacourse/mission-utils';
import Calculator from "./Calculator.js"

const { Console } = MissionUtils;

export default class App {
  async run() {
    try {
      const input = await Console.readLineAsync('덧셈할 문자열을 입력해주세요.\n');
      const result = Calculator.calculate(input);
      Console.print(`결과 : ${result}`);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('[ERROR]')) {
        Console.print(error.message);
        return;
      }
      // 예기치 못한 오류
      Console.print('[ERROR] 알 수 없는 오류가 발생했습니다.');
    }
  }
}
