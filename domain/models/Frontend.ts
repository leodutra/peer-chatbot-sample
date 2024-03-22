enum Frontend {
  Discord = "Discord",
  Telegram = "Telegram",
  WhatsApp = "WhatsApp",
}

export default Frontend;

export function frontendByName(name: string): Frontend | undefined {
  return Frontend[name as keyof typeof Frontend];
}
