export default function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>AI Assistant</h1>
      <p>The chatbot will appear automatically below:</p>
      {/* ChatKit container */}
      <div id="chatkit-container" style={{ height: "600px", width: "100%" }}></div>
    </main>
  );
}