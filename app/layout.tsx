import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chatbot",
  description: "ChatKit chatbot",
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
        {domainKey && workflowId && (
          <>
            <script
              src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
              async
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function () {
                    function init() {
                      if (window.ChatKit && window.ChatKit.init) {
                        window.ChatKit.init({
                          domainKey: "${domainKey}",
                          workflowId: "${workflowId}",
                        });
                      } else {
                        setTimeout(init, 100);
                      }
                    }
                    init();
                  })();
                `,
              }}
            />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}