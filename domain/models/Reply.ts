import ReplyImage from "./ReplyImage";

type Reply = {
  text: string;
  images: ReplyImage[];
  skipped: boolean;
  error: boolean;
};

export default Reply;
