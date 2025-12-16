"use client";
import Script from "next/script";
import { useEffect } from "react";

interface ChatKitLoaderProps {
  domainKey: string;
  workflowId?: string;
}

export default function ChatKitLoader({ domainKey, workflowId }: ChatKitLoaderProps) {
  useEffect(() => {
    if (!domainKey) return console.error("DEBUG: domainKey missing");

    // Poll for ChatKit every 100ms up to 5 seconds
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.ChatKit && window.ChatKit.init) {
        console.log("DEBUG: ChatKit found, initializing...");
        const cfg: any = { domainKey };
        if (workflowId) cfg.workflowId = workflowId;
        window.ChatKit.init(cfg);
        console.log("DEBUG: ChatKit initialized");
        clearInterval(interval);
      } else if (attempts > 50) { // ~5s timeout
        console.error("DEBUG: ChatKit did not appear on window after 5 seconds");
        clearInterval(interval);
      }
    }, 100);
  }, [domainKey, workflowId]);

  return (
    <Script
      src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
      strategy="afterInteractive"
      onLoad={() => console.log("DEBUG: ChatKit script loaded")}
      onError={(e) => console.error("DEBUG: Failed to load ChatKit script", e)}
    />
  );
}