export default interface FrontendFormatter {
  bold(text: string): string;
  italic(text: string): string;
  monospace(text: string): string;
  strikethrough(text: string): string;
  underline(text: string): string;
  codeBlock(text: string): string;
}
