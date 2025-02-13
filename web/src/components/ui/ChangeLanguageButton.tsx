import Button from "@mui/material/Button";
import LanguageIcon from "@mui/icons-material/Language";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useTranslation } from "react-i18next";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { useCallback, useState } from "react";
import { languages } from "../../utils/i18n/languages";

const ChangeLanguageButton = () => {
  const { i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLanguageChange = useCallback(
    (lang: string) => {
      i18n.changeLanguage(lang);
      setIsMenuOpen(false);
    },
    [i18n]
  );

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <Box position="relative" width="min-content" maxWidth="100px">
      <Button
        variant="contained"
        size="small"
        color="secondary"
        startIcon={<LanguageIcon />}
        endIcon={<KeyboardArrowDownRoundedIcon />}
        onClick={() => handleToggleMenu()}
      >
        {i18n.language.toUpperCase()}
      </Button>

      {isMenuOpen && (
        <ClickAwayListener onClickAway={handleCloseMenu}>
          <Paper
            elevation={3}
            sx={{ marginTop: "6px", position: "absolute", zIndex: 10 }}
          >
            <MenuList>
              {languages.map((lang) => (
                <MenuItem
                  key={lang}
                  selected={lang === i18n.language}
                  onClick={() => handleLanguageChange(lang)}
                  sx={{ fontSize: "0.8rem" }}
                >
                  {lang.toUpperCase()}
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      )}
    </Box>
  );
};

export default ChangeLanguageButton;
