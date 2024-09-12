import { createContext, useState } from "react";

export const Context = createContext();

export default function ContextProvider({ children }) {

  // let ngrokUrl = 'https://eb99-49-249-133-22.ngrok-free.app';
  // let ngrokUrl = '';
  // url: ngrokUrl.replace('https://', 'wss://') + '/',
  // isConnected: ngrokUrl ? true : false,

  const [localConnection, setLocalConnection] = useState({
    isConnected: false,
    url: '',
  });
  return (
    <Context.Provider value={{ localConnection, setLocalConnection }}>
        {children}
    </Context.Provider>
  );
}
