"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

interface ChatKitLoaderProps {
  domainKey: string;
  workflowId?: string;
}

declare global {
  interface Window {
    ChatKit?: {
      init: (config: { domainKey: string; workflowId?: string }) => void;
    };
  }
}

export default function ChatKitLoader({ domainKey, workflowId }: ChatKitLoaderProps) {
  const [status, setStatus] = useState("Loading ChatKit...");

  useEffect(() => {
    if (!domainKey) {
      console.error("DEBUG: domainKey missing");
      setStatus("Error: domainKey missing");
      return;
    }

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.ChatKit && window.ChatKit.init) {
        console.log("DEBUG: ChatKit found, initializing...");
        const cfg: any = { domainKey };
        if (workflowId) cfg.workflowId = workflowId;
        window.ChatKit.init(cfg);
        console.log("DEBUG: ChatKit initialized");
        setStatus("ChatKit initialized successfully");
        clearInterval(interval);
      } else if (attempts > 100) { // ~10s timeout
        console.error("DEBUG: ChatKit did not appear on window after 10 seconds");
        setStatus("Error: ChatKit did not load");
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval); // cleanup on unmount
  }, [domainKey, workflowId]);

  return (
    <>
      <Script
        src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
        strategy="afterInteractive"
        onLoad={() => console.log("DEBUG: ChatKit script loaded")}
        onError={(e) => {
          console.error("DEBUG: Failed to load ChatKit script", e);
          setStatus("Error: Failed to load ChatKit script");
        }}
      />
      <div style={{ position: "absolute", top: 0, right: 0, padding: "0.5rem", background: "#fff", color: "#000", zIndex: 1000 }}>
        {status}
      </div>
    </>
  );
}