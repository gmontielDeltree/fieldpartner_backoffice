import { CssBaseline, ThemeProvider } from "@mui/material";
// import { skyBlueTheme } from "./";
import { purpleTheme } from "./purpleTheme";

interface AppThemeProps {
    children: React.ReactNode;
}

export const AppTheme: React.FC<AppThemeProps> = ({ children }) => {
    return (
        <ThemeProvider theme={purpleTheme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />

            {children}
        </ThemeProvider>
    )
}