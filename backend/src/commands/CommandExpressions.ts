import { ARG_SEPARATOR } from "../constants";
import ChatbotCommand from "./ChatbotCommand";

type Expression<C, T> = {
  interpret(context: C): T;
};
type TerminalExpression<C, T> = Expression<C, T>;
type NonTerminalExpression<C, T> = Expression<C, T>;

export type CommandsMap = Map<
  ReturnType<ChatbotCommand["getId"]>,
  ChatbotCommand
>;

export type Context = {
  commandsMap: CommandsMap;
};

export class CommandExpression
  implements
    NonTerminalExpression<
      Context,
      { command: ChatbotCommand; args: string[] } | null
    >
{
  constructor(
    private nameExpression: Expression<Context, ChatbotCommand | null>,
    private argsExpression: Expression<Context, string[]>
  ) {}

  interpret(context: Context) {
    const command = this.nameExpression.interpret(context);
    if (command) {
      const args = this.argsExpression.interpret(context);
      return { command, args };
    }
    return null;
  }
}

// CommandSymbolExpression is not needed yet

export class CommandNameExpression
  implements TerminalExpression<Context, ChatbotCommand | null>
{
  constructor(private commandName: string) {}

  interpret(context: Context) {
    return context.commandsMap.get(this.commandName) ?? null;
  }
}

export class CommandArgsExpression
  implements TerminalExpression<Context, string[]>
{
  constructor(private commandArgs: string) {}

  interpret(_context: Context) {
    return this.commandArgs
      .split(ARG_SEPARATOR)
      .map((arg) => arg.trim())
      .filter(Boolean);
  }
}
