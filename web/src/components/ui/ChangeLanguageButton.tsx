import Button from "@mui/material/Button";
import LanguageIcon from "@mui/icons-material/Language";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useTranslation } from "react-i18next";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { useState } from "react";
import { languages } from "../../utils/i18n/languages";

export default function ChangeLanguageButton() {
  const { i18n } = useTranslation();
  const [menuIsOpened, setMenuIsOpened] = useState(false);

  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang);
    setMenuIsOpened(false);
  };

  const toggleMenuHandler = () => {
    setMenuIsOpened((prev) => !prev);
  };

  const closeMenuHandler = () => {
    setMenuIsOpened(false);
  };

  return (
    <Box position="relative" width="min-content" maxWidth="100px">
      <Button
        variant="outlined"
        size="small"
        startIcon={<LanguageIcon />}
        endIcon={<KeyboardArrowDownRoundedIcon />}
        onClick={() => toggleMenuHandler()}
      >
        {i18n.language.toUpperCase()}
      </Button>

      {menuIsOpened && (
        <ClickAwayListener onClickAway={closeMenuHandler}>
          <Paper elevation={3} sx={{ marginTop: "6px" }}>
            <MenuList>
              {languages.map((lang) => (
                <MenuItem
                  key={lang}
                  selected={lang === i18n.language}
                  onClick={() => changeLanguageHandler(lang)}
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
}
