import React from "react";

export interface LumiState {
  title: string;
  connected: boolean;
  loading: boolean;
  update: (obj: any) => void;
}

const LumiContext = React.createContext<LumiState | null>(null);

export const LumiProvider = LumiContext.Provider;
export const LumiConsumer = LumiContext.Consumer;

export default LumiContext;
