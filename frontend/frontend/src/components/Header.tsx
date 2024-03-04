import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar, Tooltip,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher.tsx";
interface Props {
  variant: "not_main" | "editable" | "default";
  title: string;
}

export const Header = ({ variant, title }: Props) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEdit = () => {
    console.log("edit");
    navigate("edit")
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ margin: "auto", flexGrow: 1, alignItems: "space-between",width: "100%"}}
      >
        <Toolbar>
          <Box>
            <Tooltip title={t("home")}>
              <IconButton
                onClick={() => navigate("/")}
                sx={{ padding: 0, borderRadius: 5 }}
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
                    sx={{ mr: 2 }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Tooltip>
            )}
          </Box>
          <Typography
            variant="h5"
            component="div"
            sx={{ margin: "auto", textAlign: "center" }}
          >
            {title}
            {variant === "editable" && (
              <IconButton
                onClick={handleEdit}
                disableRipple={true}
                sx={{ marginBottom: 1, color: "text.secondary" }}
              >
                <EditIcon />
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
              <LanguageSwitcher />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};