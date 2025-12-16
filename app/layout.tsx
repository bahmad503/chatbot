import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Chatbot",
  description: "ChatKit + OpenAI Agent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const domainKey = process.env.NEXT_PUBLIC_OPENAI_DOMAIN_KEY;
  const workflowId = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID;

  return (
    <html lang="en">
      <head>
        {domainKey && (
          <>
            <script
              src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
              async
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(){
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
                })();`,
              }}
            />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}