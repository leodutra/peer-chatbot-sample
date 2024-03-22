import FrontendFormatter from "./FrontendFormatter";
import formatPerLine from "./formatPerLine";

export default class DiscordFormatter implements FrontendFormatter {
  bold(text: string): string {
    return `**${text}**`;
  }
  italic(text: string): string {
    return `_${text}_`;
  }
  monospace(text: string): string {
    return `\`\`\`${text}\`\`\``;
  }
  strikethrough(text: string): string {
    return `~~${text}~~`;
  }
  underline(text: string): string {
    return `__${text}__`;
  }
  codeBlock(text: string): string {
    return formatPerLine(text, this.monospace);
  }
}
