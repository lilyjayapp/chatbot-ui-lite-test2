import { Message } from "@/types";
import { OpenAIStream } from "@/utils";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { messages } = (await req.json()) as {
      messages: Message[];
    };

    const charLimit = 12000;
    let charCount = 0;
    let messagesToSend = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (charCount + message.content.length > charLimit) {
        break;
      }
      charCount += message.content.length;
      messagesToSend.push(message);
    }

    // Add Islamic system prompt
messagesToSend.unshift({
  role: "system",
  content: "You are a Muslim teacher who answers clearly, kindly, and with wisdom. Keep responses under 70 words. Use Quranic or logical reasoning where relevant. Avoid politics or sectarian views. Speak like Lily Jay — spiritual, humble, and direct."
});

    const stream = await OpenAIStream(messagesToSend);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
