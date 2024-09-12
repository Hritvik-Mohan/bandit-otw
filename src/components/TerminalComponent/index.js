import { Terminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";
import { useContext, useState } from "react";
import { Context } from "@/context/context";

export default function TerminalComponent() {
  const terminalRef = useRef(null); // Terminal container ref
  const term = useRef(null); // Terminal instance ref
  const ws = useRef(null); // WebSocket instance ref

  const { localConnection, setLocalConnection } = useContext(Context);

  useEffect(() => {
    // Create a new WebSocket connection
    ws.current = new WebSocket(localConnection.url);

    ws.current.onopen = () => {
      // WebSocket connection opened, update isConnected to true
      setLocalConnection((prev) => ({
        ...prev,
        isConnected: true,
      }));
      console.log("WebSocket connected");
    };

    ws.current.onclose = () => {
      // WebSocket connection closed, update isConnected to false
      setLocalConnection((prev) => ({
        ...prev,
        isConnected: false,
      }));
      console.log("WebSocket disconnected");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      // Optionally, set isConnected to false on error
      setLocalConnection((prev) => ({
        ...prev,
        isConnected: false,
      }));
    };

    console.log(ws.current);

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
  }, [localConnection.url]);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Create a new Terminal instance
    term.current = new Terminal({ rows: 50, cols: 100 });

    // Open the terminal in the container div
    term.current.open(terminalRef.current);

    // Handle keyboard input and send it via WebSocket
    term.current.onKey((e) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: "command",
            data: e.key,
          })
        );
      }
    });
    term.current.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
    // Clean up Terminal instance when the component unmounts
    return () => {
      if (term.current) {
        term.current.dispose();
      }
    };
  }, []);

  const [url, setUrl] = useState("");

  const handleClick = (e) => {
    e.preventDefault;

    const webSocketUrl = url.replace("https://", "wss://") + "/";

      setLocalConnection({
        isConnected: false,
        url: webSocketUrl,
      });
  };

  return (
    <div>
      <div className="bg-[#eef8ff] p-4 button flex justify-between gap-6 items-center">
        <div className="flex">
          <img
            src="https://my.newtonschool.co/assets/logo.svg"
            className="mr-6"
          />
          {/* <button className="bg-[#0066ff] hover:bg-[#1472ff] text-white font-bold py-2 px-4 rounded">
              Back
            </button> */}
          <div className="grid items-center">
            <h1 className="text-[#4b4f52] text-[2rem]">
              Over the wire: Bandit
            </h1>
            {localConnection.isConnected ? (
              <div className="flex items-center ml-0.5 text-emerald-500 font-medium animate-pulse">
                Connected
                {/* <span className="connected-icon flex items-center animate-pulse"></span> */}
              </div>
            ) : (
              <div className="flex items-center ml-0.5 text-red-600 font-medium animate-pulse">
                Disconnected
                {/* <span className="disconnected-icon flex items-center animate-pulse"></span> */}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-6">
          <label className="text-[#4b4f52] flex items-center font-bold">
            Add URL here:{" "}
          </label>
          <div>
            <input
              type="url"
              className="form-input text-black rounded"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={handleClick}
              class="bg-[#28abe5] hover:bg-[#5bbbea] text-white font-bold py-2 px-4 rounded"
            >
                <span>Connect</span>
            </button>
          </div>
        </div>
      </div>

      <div
        id="terminal"
        ref={terminalRef}
        style={{ height: "100vh" }}
        className="terminal-component"
      ></div>
    </div>
  );
}
