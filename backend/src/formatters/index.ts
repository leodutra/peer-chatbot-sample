import Frontend from "chatbot-sample-domain/models/Frontend";
import DiscordFormatter from "./DiscordFormatter";
import FrontendFormatter from "./FrontendFormatter";

export function factoryFrontendFormatter(
  frontend: Frontend
): FrontendFormatter {
  switch (frontend) {
    case Frontend.Discord:
      return new DiscordFormatter();
    // TODO: Uncomment the following lines when the other platforms are implemented
    // case Frontend.Telegram:
    //   return new TelegramFormatter();
    // case Frontend.WhatsApp:
    //   return new WhatsAppFormatter();
    default:
      throw new Error("Invalid frontend");
  }
}
