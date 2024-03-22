import { Client, Events, GatewayIntentBits, Message, ShardEvents } from "discord.js";
import mime from "mime";

import Chatbot from "chatbot-sample-middleware";
import Frontend from "chatbot-sample-domain/models/Frontend";
import Reply from "chatbot-sample-domain/models/Reply";

import { discordToken } from "./credentials.json";

const SERVICE_ENDPOINT = "http://localhost:3000/v1/chatbot";

const chatbot = new Chatbot(SERVICE_ENDPOINT);

async function main() {
  const client = new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      // GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.once(Events.ClientReady, async () => console.log("Ready!"));
//   client.once(ShardEvents.Reconnecting, async () =>
//     console.log("Reconnecting!")
//   );
//   client.once(ShardEvents.Disconnect, async () => console.log("Disconnect!"));
  client.on('messageCreate', async (message: Message) => {
    console.log("received message");
    console.log(message);
    /*
        Message {
            channel: DMChannel {
                type: 'dm',
                deleted: false,
                id: '580252712906653697',
                recipient: [User],
                lastMessageID: '580253029299781633',
                lastPinTimestamp: null,
                messages: [Collection],
                _typing: Map {}
            },
            deleted: false,
            id: '580253029299781633',
            type: 'DEFAULT',
            content: 'djkdjks',
            author: User {
                id: '261958667706957825',
                username: 'HARD',
                discriminator: '2516',
                avatar: 'a4f31996702a64b43e859713ceeb93fc',
                bot: false,
                lastMessageID: '580253029299781633',
                lastMessage: [Circular]
            },
            member: null,
            pinned: false,
            tts: false,
            nonce: '580253029014437888',
            system: false,
            embeds: [],
            attachments: Collection [Map] {},
            createdTimestamp: 1558413502765,
            editedTimestamp: null,
            reactions: Collection [Map] {},
            mentions: MessageMentions {
                everyone: false,
                users: Collection [Map] {},
                roles: Collection [Map] {},
                _content: 'djkdjks',
                _client: [Client],
                _guild: undefined,
                _members: null,
                _channels: null
            },
            webhookID: null,
            hit: null,
            _edits: []
        }
    */
    if (message.author.bot) return;
    try {
      await chatbot.invoke(
        {
          message: message.content,
          group: message.channel.id,
          frontend: Frontend.Discord,
          from: message.author.id,
          to: message.guild?.id ?? '',
        },
        async (reply: Reply) => {
          console.log('reply = ', reply)
          if (reply.skipped) {
            return;
          }
          if (reply.text) {
            await message.reply(reply.text);
          }
          // let imgCounter = 1;
          // for (const image of reply.images) {
          //   const imgDetails = bufferFromDataURI(image);
          //   await message.reply(
          //     new Discord.Attachment(
          //       imgDetails.data,
          //       `img-${imgCounter++}.${mime.getExtension(imgDetails.mimeType)}`
          //     )
          //   );
          // }
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
  );
  console.log("Discord bot is using token: ", discordToken);
  await client.login(discordToken);
}

function bufferFromDataURI(dataURI?: string) {
  const uriParts =
    dataURI?.match(
      /^data:((?:[^,](?!,|;base64))*[^,])?(?:;(base64))?,(.+)/im
    ) || [];
  if (uriParts) {
    const [str, mimeType, encoding, data] = uriParts;
    return {
      mimeType: mimeType,
      data:
        encoding && data ? Buffer.from(data, encoding as BufferEncoding) : data,
    };
  }
  return null;
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
