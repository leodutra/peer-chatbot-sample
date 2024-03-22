import ChatbotCommand from "./ChatbotCommand";
import {
  CommandArgsExpression,
  CommandExpression,
  CommandNameExpression,
} from "./CommandExpressions";

const CMD_PREFIX = "!";

const commandRegex = () =>
  new RegExp(
    `${CMD_PREFIX}(\\w+)\\s*([^;${CMD_PREFIX}]*)(?=[;${CMD_PREFIX}]|$)`,
    "gim"
  );

export type MatchedCommand = {
  command: ChatbotCommand;
  args: string[];
};

export default class CommandParser {
  static parse(message: string): CommandExpression[] {
    const commandMatcher = commandRegex();
    let regexMatches;
    let output = [];
    while ((regexMatches = commandMatcher.exec(message))) {
      let [_, commandId, commandArgs] = regexMatches;
      output.push(
        new CommandExpression(
          new CommandNameExpression(commandId),
          new CommandArgsExpression(commandArgs)
        )
      );
    }
    return output;
  }
}
