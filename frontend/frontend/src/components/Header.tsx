import {AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import {AccountCircle} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
interface Props {
  variant: "variant-2" | "variant-3" | "default";
  username: string;
  title: string;
}

//TODO: add language switcher

export const Header = ({ variant, title }: Props) => {
  const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

  return (
    <>
      <AppBar position="fixed" sx={{ margin: 0 }}>
          <Toolbar>
              <IconButton sx={{padding: 0, borderRadius: 5}}>
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
              {variant !== "default" && (
                  <IconButton
                      size="large"
                      edge="start"
                      color="inherit"
                      aria-label="back"
                      sx={{mr: 2}}
                  >
                      <ArrowBackIcon/>
                  </IconButton>
              )}
              <Typography
                  variant="h5"
                  component="div"
                  sx={{flexGrow: 1, textAlign: "center"}}
              >
                  {title}
              </Typography>
              <div>
                  <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="secondary"
                  >
                      <AccountCircle/>
                  </IconButton>
                  <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                  >
                      <MenuItem onClick={handleClose}>Profile</MenuItem>
                      <MenuItem onClick={logout}>Logout</MenuItem>
                  </Menu>
              </div>
          </Toolbar>
      </AppBar>
    </>
  );
};
