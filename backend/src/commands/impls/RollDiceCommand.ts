import ChatbotCommand from "../ChatbotCommand";
import CommandInvocation from "../CommandInvocation";
import Reply from "../../Reply";


export default class RollDiceCommand implements ChatbotCommand {
  getId(): string {
    return 'd';
  }

  getDescription(): string {
    return 'Rolls a dice';
  }

  async execute({ args, reply }: CommandInvocation) {
    const faces = parseInt(args[0]);
    if (isNaN(faces)) {
      await reply(Reply.text('Invalid number of faces'));
      return;
    }
    const dice = args.length > 1 ? Math.max(1, parseInt(args[1])) : 1;
    const results = [];
    for (let i = 0; i < dice; i++) {
      results.push(Math.floor(Math.random() * faces) + 1);
    }
    const result = results.join(', ');
    await reply(Reply.text(`Rolled ${dice} dice(s) with ${faces} faces and got ${result}`));
  }
}
