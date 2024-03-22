import ReplyType from "chatbot-sample-domain/models/Reply";
import ReplyImage from "chatbot-sample-domain/models/ReplyImage";
import { SKIP_CHARACTER } from "./constants";


const appendSkipCharacter = (text?: string | null) =>
  text ? `${text + SKIP_CHARACTER}` : "";

export default class Reply implements ReplyType {
  text: string = "";
  images: ReplyImage[] = [];
  skipped: boolean = false;
  error: boolean = false;

  static text(text: string): Reply {
    return {
      text: appendSkipCharacter(text),
      images: [],
      skipped: false,
      error: false,
    };
  }

  static images(images: ReplyImage[], text?: string | null): Reply {
    return {
      text: appendSkipCharacter(text),
      images: [],
      skipped: false,
      error: false,
    };
  }

  static error(text: string): Reply {
    return {
      text: appendSkipCharacter(text),
      images: [],
      skipped: false,
      error: true,
    };
  }

  static skipped(text?: string | null): Reply {
    return {
      text: appendSkipCharacter(text),
      images: [],
      skipped: true,
      error: false,
    };
  }
}
