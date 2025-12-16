"use client"; // ← This is required for useEffect

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Debug: confirm the container exists
    const container = document.getElementById("chatkit-container");
    if (!container) {
      console.warn("DEBUG: chatkit-container div not found");
    } else {
      console.log("DEBUG: chatkit-container div exists");
    }

    // Debug: check if ChatKit is loaded yet
    if (window.ChatKit) {
      console.log("DEBUG: ChatKit object exists on window");
    } else {
      console.warn("DEBUG: ChatKit object NOT found on window");
    }
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>AI Assistant</h1>
      <p>The chatbot will appear automatically below:</p>
      <div
        id="chatkit-container"
        style={{ height: "600px", width: "100%", border: "1px dashed red" }}
      >
        {/* Red border for debugging */}
      </div>
    </main>
  );
}