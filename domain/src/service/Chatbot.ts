import ChatbotInvocation from "../../models/ChatbotInvocation";
import ReplyCallback from "../../models/ReplyCallback";

export type InvokeChatbotFn = (
  invocation: ChatbotInvocation,
  reply: ReplyCallback
) => Promise<void>;

type Chatbot = { invoke: InvokeChatbotFn };

export default Chatbot;
