import React from "react";

const LumiContext = React.createContext({});

export const LumiProvider = LumiContext.Provider;
export const LumiConsumer = LumiContext.Consumer;
export default LumiContext;
