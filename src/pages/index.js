import Form from "@/components/Form";
import TerminalComponent from "@/components/TerminalComponent";
import { useContext } from "react";
import { Context } from "@/context/context";

export default function Home() {
  const { localConnection } = useContext(Context);
  console.log(localConnection);

  return (
    <div className="App">
        {/* {localConnection.isConnected ? <TerminalComponent /> : <Form />} */}
        <TerminalComponent />
    </div>
  );
}
