import { Terminal } from "@xterm/xterm"; // No need for "@"
import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";

export default function TerminalComponent() {
  const terminalRef = useRef(null); // Terminal container ref
  const term = useRef(null); // Terminal instance ref
  const ws = useRef(null); // WebSocket instance ref

  useEffect(() => {
    // Create a new WebSocket connection
    ws.current = new WebSocket('ws://localhost:3000');


    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "data") {
        term.current.write(data.data); // Write to terminal
      }
    };

    // Clean up WebSocket connection when the component unmounts
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Create a new Terminal instance
    term.current = new Terminal();

    // Open the terminal in the container div
    term.current.open(terminalRef.current);

    // Handle keyboard input and send it via WebSocket
    term.current.onKey((e) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: "command",
            data: e.key,
          }),
        );
      }
    });
    term.current.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    // Clean up Terminal instance when the component unmounts
    return () => {
      if (term.current) {
        term.current.dispose();
      }
    };
  }, []);

  return (
    <div>
      <div id="terminal" ref={terminalRef}></div>
    </div>
  );
}
