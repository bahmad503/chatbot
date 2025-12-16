"use client";

import Script from "next/script";

declare global {
  interface Window {
    ChatKit?: {
      init: (config: { domainKey: string; workflowId?: string }) => void;
    };
  }
}

interface ChatKitLoaderProps {
  domainKey: string;
  workflowId?: string;
}

export default function ChatKitLoader({ domainKey, workflowId }: ChatKitLoaderProps) {
  if (!domainKey) return <div>ChatKit domainKey missing!</div>;

  return (
    <Script
      src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log("DEBUG: ChatKit script loaded");

        if (window.ChatKit && window.ChatKit.init) {
          const cfg: any = { domainKey };

          // Ensure workflowId is only added if defined
          if (workflowId) cfg.workflowId = workflowId;

          window.ChatKit.init(cfg);
          console.log("DEBUG: ChatKit initialized for domain:", window.location.hostname);
        } else {
          console.warn("DEBUG: ChatKit not found on window after load");
        }
      }}
      onError={(e) => console.error("DEBUG: Failed to load ChatKit script", e)}
    />
  );
}