import CommandInvocation from "./CommandInvocation";

export default interface ChatbotCommand {
  getId(): string;
  getDescription(): string;
  execute(invocation: CommandInvocation): Promise<void>;
}

