import { createContext, useContext } from "react";
import { TabsContextValue } from "../components/tabs/types";

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("Tabs.Item must be used within a Tabs component");
    }
    return context;
}
