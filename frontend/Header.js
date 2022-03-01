import * as React from "react";

// Importing material UI components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Header() {
    return (
        <AppBar position="sticky">
            <Toolbar style={{background: "#2196f3"}}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Brain Tumor Detector</Typography>
            </Toolbar>
        </AppBar>
    );
}