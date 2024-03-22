import ChatbotInvocation from "chatbot-sample-domain/models/ChatbotInvocation";

import Reply from "./src/Reply";
import RollDiceCommand from "./src/commands/impls/RollDiceCommand";
import ChatbotEngine from "./src/ChatbotEngine";

console.log("Starting service...");

const commands = [new RollDiceCommand()];
const chatbotEngine = new ChatbotEngine(commands);

const listChatbotCommands = async () => {
  return new Response(JSON.stringify(await chatbotEngine.listCommands()), {
    headers: { "Content-Type": "application/json" },
  });
};

const invokeChatbot = async(req: Request) => {
  const stream = new ReadableStream({
    start(controller) {
      const reply = async (message: Reply) => {
        try {
          controller.enqueue(JSON.stringify(message));
        } catch (e) {
          console.error(e);
        }
      };

      (async () => {
        try {
          const data = (await req.json()) as ChatbotInvocation;
          if (data) {
            console.log("Request json:", data);
            return await chatbotEngine.invoke(data, reply);
          }
          throw new Error("Missing JSON data");
        } catch (e) {
          console.error(e);
        } finally {
          controller.close();
          console.log("Stream closed");
        }
      })();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/json" },
  });
};


const fetch = async (req: Request) => {
  const url = new URL(req.url);
  console.log("requested pathname:", url.pathname);
  if (url.pathname === "/v1/chatbot" && req.method === "POST")
    return invokeChatbot(req);
  if (url.pathname === "/v1/chatbot/commands" && req.method === "GET")
    return listChatbotCommands();
  return new Response("404!");
}

const error = async (error: Error) => {
  return new Response(`<pre>${error}\n${error.stack}</pre>`, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

Bun.serve({ fetch, error });

console.log("Service started. Send POST messages to 0.0.0.0:3000/v1/chatbot");
