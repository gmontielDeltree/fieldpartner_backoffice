import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createFieldpartnerTheme } from "./fieldpartnerTheme";
import { ColorModeProvider, useColorMode } from "./ColorMode";
import "./foundation.css";

interface AppThemeProps {
    children: React.ReactNode;
}

const ThemedApp: React.FC<AppThemeProps> = ({ children }) => {
    const { mode } = useColorMode();
    const theme = useMemo(() => createFieldpartnerTheme(mode), [mode]);
    return (
        <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />

            {children}
        </ThemeProvider>
    );
};

export const AppTheme: React.FC<AppThemeProps> = ({ children }) => (
    <ColorModeProvider>
        <ThemedApp>{children}</ThemedApp>
    </ColorModeProvider>
);
