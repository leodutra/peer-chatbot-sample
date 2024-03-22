import axios, { AxiosRequestConfig } from "axios";
import JSONStream from "jsonstream";
import ChatbotType from "chatbot-sample-domain/src/service/Chatbot";
import ChatbotInvocation from "chatbot-sample-domain/models/ChatbotInvocation";
import ReplyCallback from "chatbot-sample-domain/models/ReplyCallback";

const hasCommand = (str: string) => str.match(/!\w/);
const hasSkip = (str: string) => str.match(/(?:^|\s)!skip(?:\s|$)/);

export default class Chatbot implements ChatbotType {
  serviceEndpoint: string;

  constructor(serviceEndpoint: string) {
    if (!serviceEndpoint) {
      throw new Error(`Missing serviceEndpoint for ${Chatbot.name}`);
    }
    this.serviceEndpoint = serviceEndpoint;
  }

  async invoke(invocation: ChatbotInvocation, reply: ReplyCallback) {
    const { message } = invocation;
    const skip = async (text: string) => {
      console.log(text);
      await reply({ text, skipped: true, error: false, images: [] });
    };
    if (!hasCommand(message)) {
      return skip(`No command found on\n"${message}". Skipping.`);
    }
    if (hasSkip(message)) {
      return skip(`"!skip" found on\n"${message}". Skipping.`);
    }
    return this.#postInvocation(invocation, reply);
  }

  async #postInvocation(
    invocation: ChatbotInvocation,
    reply: ReplyCallback
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const rejectWithError = (error: any) => {
        console.error(error);
        reject(error);
      };

      let stream;
      try {
        const config: AxiosRequestConfig<ChatbotInvocation> = {
          responseType: "stream",
        };
        const response = await axios.post(
          this.serviceEndpoint,
          invocation,
          config
        );
        stream = response.data;
      } catch (error: any) {
        rejectWithError(error);
        return;
      }

      const replyPromises: Promise<void>[] = [];

      const jsonStream = JSONStream.parse(true);
      stream.pipe(jsonStream);

      jsonStream.on("data", (data) => {
        console.log("received data (stream)", data);
        replyPromises.push(reply(data));
      });

      jsonStream.on("error", rejectWithError);

      jsonStream.on("close", () => {
        console.log("JSON stream was closed");
        Promise.all(replyPromises)
          .then(() => resolve())
          .catch(rejectWithError);
      });
    });
  }
}
