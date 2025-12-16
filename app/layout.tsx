import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

declare global {
  interface Window {
    ChatKit?: {
      init: (config: any) => void;
    };
  }
}

export const metadata: Metadata = {
  title: "AI Chatbot",
  description: "ChatKit + OpenAI Agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const domainKey = process.env.NEXT_PUBLIC_OPENAI_DOMAIN_KEY;
  const workflowId = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID;

  // Debug: log environment variables to browser console
  if (typeof window !== "undefined") {
    console.log("DEBUG: ChatKit domainKey =", domainKey);
    console.log("DEBUG: ChatKit workflowId =", workflowId);
  }

  if (!domainKey) {
    console.warn(
      "DEBUG: ChatKit domainKey is missing. Check environment variables!"
    );
  }

  return (
    <html lang="en">
      <head>
        {domainKey && (
          <>
            <Script
              src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
              strategy="afterInteractive"
              onLoad={() => {
                console.log("DEBUG: ChatKit script loaded");

                // Check if ChatKit is available
                if (window.ChatKit && window.ChatKit.init) {
                  console.log("DEBUG: ChatKit is available, initializing...");
                  const cfg: any = { domainKey };
                  if (workflowId) cfg.workflowId = workflowId;
                  window.ChatKit.init(cfg);
                } else {
                  console.warn("DEBUG: ChatKit not found on window after load");
                }
              }}
              onError={(e) => console.error("DEBUG: Failed to load ChatKit script", e)}
            />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}