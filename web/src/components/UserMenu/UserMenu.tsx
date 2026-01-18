import { useUserStore } from "../../store/userStore";
import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useLogoutMutation } from "../../hooks/useLogoutMutation";

const UserMenu = () => {
  const logoutMutation = useLogoutMutation();
  const user = useUserStore((state) => state.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!user) return null;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    handleMenuClose();
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <Avatar
          sx={{
            bgcolor: "background.paper",
            color: "text.primary",
            fontWeight: 500,
            fontSize: "1rem",
          }}
        >{`${user.name.charAt(0)}${user.surname.charAt(0)}`}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 1 }}
      >
        <Typography sx={{ px: 2, py: 1, fontWeight: "bold" }} color="primary">
          {`${user.name} ${user.surname}` || "Nieznany użytkownik"}
        </Typography>
        <MenuItem onClick={handleLogout}>Wyloguj</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
