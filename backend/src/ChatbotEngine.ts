import ChatbotInvocation from "chatbot-sample-domain/models/ChatbotInvocation";
import { frontendByName } from "chatbot-sample-domain/models/Frontend";
import ReplyCallback from "chatbot-sample-domain/models/ReplyCallback";
import Chatbot from "chatbot-sample-domain/src/service/Chatbot";
import Reply from "./Reply";
import ChatbotCommand from "./commands/ChatbotCommand";
import CommandInterpreter from "./commands/CommandInterpreter";
import { SKIP_CHARACTER } from "./constants";
import { factoryFrontendFormatter } from "./formatters";

export default class ChatbotEngine implements Chatbot {
  constructor(private commands: ChatbotCommand[]) {}

  async invoke(
    { message, to, from, group, frontend }: ChatbotInvocation,
    reply: ReplyCallback
  ) {
    if (message.includes(SKIP_CHARACTER)) return;

    let frontendType = frontendByName(frontend);

    if (!frontendType) {
      reply(Reply.error("Invalid frontend parameter"));
      return;
    }

    let formatter = factoryFrontendFormatter(frontendType);

    const commandsToInvoke = new CommandInterpreter().interpretCommands(
      message,
      this.commands
    );

    await Promise.all(
      commandsToInvoke.map(({ command, args }) => {
        return command.execute({
          args,
          from,
          to,
          group,
          frontend: frontendType!,
          reply,
          formatter,
        });
      })
    );
  }

  async listCommands() {
    return this.commands.map((command) => ({
      id: command.getId(),
      description: command.getDescription(),
    }));
  }
}
