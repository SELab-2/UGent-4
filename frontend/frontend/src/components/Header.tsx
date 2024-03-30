import {AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography,} from "@mui/material";
import {useTranslation} from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import {AccountCircle} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {LanguageSwitcher} from "./LanguageSwitcher.tsx";

/**
 * Header component
 * Header bar for each page, contains the logo, title, back button, edit button, and user menu
 * IMPORTANT: put margin on box that comes directly under the header because of the fixed position of the header
 * variants: "not_main" - pages that need a back button, "editable" - for pages that are editable, "default" - no extra buttons
 * @param {Props} variant, title - The variant and title of the header
 * @returns {JSX.Element} - The header component
 */

/**
 * Interface for Header props
 */
interface Props {
    variant: "not_main" | "editable" | "default";
    title: string;
}

/**
 * Header component
 * @param {Props} variant, title - The variant and title of the header
 */
export const Header = ({variant, title}: Props) => {
    const {t} = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    /**
     * Function to handle menu opening
     * @param {React.MouseEvent<HTMLElement>} event - The event object
     */
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Function to handle edit action
     */
    const handleEdit = () => {
        console.log("edit");
        navigate("edit")
    }

    /**
     * Function to handle menu closing
     */
    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();

    /**
     * Function to handle logout action
     */
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <>
            <AppBar
                position="absolute"
                sx={{margin: "auto", flexGrow: 1, alignItems: "space-between", width: "100%"}}
            >
                <Toolbar>
                    <Box>
                        <Tooltip title={t("home")}>
                            <IconButton
                                onClick={() => navigate("/")}
                                sx={{padding: 0, borderRadius: 5}}
                            >
                                <Box
                                    component="img"
                                    src={t("logo")}
                                    alt="logo"
                                    sx={{
                                        height: 80,
                                        width: 80,
                                        display: "block",
                                        padding: 0,
                                        margin: 0,
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                        {variant !== "default" && (
                            <Tooltip title={t("back")}>
                                <IconButton
                                    onClick={() => navigate(-1)}
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="back"
                                    sx={{mr: 2}}
                                >
                                    <ArrowBackIcon/>
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    <Typography
                        maxWidth={"88%"}
                        variant="h5"
                        component="div"
                        overflow={'auto'}
                        sx={{margin: "auto", textAlign: "center"}}
                    >
                        {title}
                        {variant === "editable" && (
                            <IconButton
                                onClick={handleEdit}
                                disableRipple={true}
                                sx={{marginBottom: 1, color: "text.secondary"}}
                            >
                                <EditIcon/>
                            </IconButton>
                        )}
                    </Typography>
                    <div>
                        <IconButton
                            size="medium"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="secondary"
                        >
                            <AccountCircle fontSize={"large"}/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <LanguageSwitcher/>
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </>
    );
};