import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "AI Chatbot",
  description: "ChatKit + OpenAI Agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const domainKey = process.env.NEXT_PUBLIC_OPENAI_DOMAIN_KEY;
  const workflowId = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID;

  return (
    <html lang="en">
      <head>
        {domainKey && (
          <>
            {/* Load ChatKit script after page is interactive */}
            <Script
              src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
              strategy="afterInteractive"
            />
            {/* Initialize ChatKit */}
            <Script id="chatkit-init" strategy="afterInteractive">
              {`
                (function(){
                  var dk="${domainKey}";
                  var wf="${workflowId || ""}";
                  function init(){
                    if(window.ChatKit && window.ChatKit.init){
                      var cfg={ domainKey: dk };
                      if(wf) cfg.workflowId = wf;
                      window.ChatKit.init(cfg);
                    } else {
                      setTimeout(init,100);
                    }
                  }
                  init();
                })();
              `}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}