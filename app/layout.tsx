import "./globals.css";
import type { Metadata } from "next";
import ChatKitLoader from "./components/ChatKitLoader";

export const metadata: Metadata = {
  title: "AI Chatbot",
  description: "ChatKit + OpenAI Agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const domainKey = process.env.NEXT_PUBLIC_OPENAI_DOMAIN_KEY;
  const workflowId = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID;

  return (
    <html lang="en">
      <head />
      <body>
        {/* Client-side ChatKit loader */}
        {domainKey && <ChatKitLoader domainKey={domainKey} workflowId={workflowId} />}
        {children}
      </body>
    </html>
  );
}