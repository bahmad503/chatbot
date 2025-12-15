import OpenAI from 'openai';
import { auth } from "@/app/(auth)/auth";
import { saveMessages, getChatById } from "@/lib/db/queries";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export async function POST(request: Request) {
  const { id, message } = await request.json();
  
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Create thread
  const thread = await openai.beta.threads.create();

  // Add user message
  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: message.parts[0].text
  });

  // Run assistant
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: process.env.OPENAI_ASSISTANT_ID!
  });

  // Poll for completion
  let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  
  while (runStatus.status !== 'completed') {
    if (runStatus.status === 'failed') {
      return Response.json({ error: 'Assistant failed' }, { status: 500 });
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  }

  // Get response
  const messages = await openai.beta.threads.messages.list(thread.id);
  const assistantMessage = messages.data[0];
  const responseText = assistantMessage.content[0].type === 'text' 
    ? assistantMessage.content[0].text.value 
    : '';

  // Save to database
  await saveMessages({
    messages: [
      {
        chatId: id,
        id: message.id,
        role: 'user',
        parts: message.parts,
        attachments: [],
        createdAt: new Date(),
      },
      {
        chatId: id,
        id: crypto.randomUUID(),
        role: 'assistant',
        parts: [{ type: 'text', text: responseText }],
        attachments: [],
        createdAt: new Date(),
      }
    ]
  });

  return Response.json({ 
    message: {
      id: crypto.randomUUID(),
      role: 'assistant',
      parts: [{ type: 'text', text: responseText }]
    }
  });
}