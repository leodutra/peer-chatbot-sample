import ChatbotCommand from "./ChatbotCommand";
import { CommandExpression } from "./CommandExpressions";
import CommandParser from "./CommandParser";

export default class CommandInterpreter {
  interpretCommands(
    message: string,
    chatbotCommands: ChatbotCommand[]
  ) {
    const commandExpressions = CommandParser.parse(message);

    console.log(
      "Command expressions found in the message:",
      commandExpressions
    );

    return commandExpressions
      .map((commandExpression) =>
        commandExpression.interpret({
          commandsMap: commandsToMap(chatbotCommands),
        })
      )
      .filter(Boolean) as NonNullable<ReturnType<CommandExpression["interpret"]>>[];
  }
}
function commandsToMap(commands: ChatbotCommand[]) {
  return new Map(commands.map((command) => [command.getId(), command]));
}
