export default function formatPerLine(text: string, fmt: (text: string) => string): string {
  return text
    .split(/\r?\n/)
    .map((line) => (line.trim() === "" ? line : fmt(line)))
    .join("\n");
}
