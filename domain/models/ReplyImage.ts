export type ImageData = {
  mime_type: string;
  content: string;
  name: string;
  extension: string;
}

export type ImageUrl = {
  url: string;
  encoding: string;
}

type ReplyImage = ImageData | ImageUrl;

export default ReplyImage
