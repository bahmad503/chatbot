"use client";

import Script from "next/script";

interface ChatKitConfig {
  domainKey: string;
  workflowId?: string;
}

interface ChatKitLoaderProps {
  domainKey: string;
  workflowId?: string;
}

declare global {
  interface Window {
    ChatKit?: {
      init: (config: ChatKitConfig) => void;
    };
  }
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
          const cfg: ChatKitConfig = { domainKey };
          if (workflowId) cfg.workflowId = workflowId;
          window.ChatKit.init(cfg);
          console.log("DEBUG: ChatKit initialized");
        } else {
          console.warn("DEBUG: ChatKit not found on window after load");
        }
      }}
      onError={(e) => console.error("DEBUG: Failed to load ChatKit script", e)}
    />
  );
}