import React from "react";
import { LumiState } from "./interfaces";

const LumiContext = React.createContext<LumiState | null>(null);

export const LumiProvider = LumiContext.Provider;
export const LumiConsumer = LumiContext.Consumer;

export default LumiContext;
