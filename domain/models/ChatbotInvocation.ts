export default interface ChatbotInvocation {
  message: string;
  frontend: string;
  from: string;
  to: string;
  group?: string | null;
}
