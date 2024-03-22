import Frontend from "chatbot-sample-domain/models/Frontend";
import FrontendFormatter from "../formatters/FrontendFormatter";
import ReplyCallback from "chatbot-sample-domain/models/ReplyCallback";

export default interface CommandInvocation {
  args: string[];
  from: string;
  to: string;
  group?: string | null;
  frontend: Frontend;
  formatter: FrontendFormatter;
  reply: ReplyCallback;
}
