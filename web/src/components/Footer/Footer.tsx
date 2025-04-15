import {
  Grid,
  IconButton,
  Stack,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useTheme } from "../../hooks/useTheme";
import Logo from "../ui/Logo/Logo";
import { useTranslation } from "react-i18next";
import { SOCIAL_LINKS } from "./socialLinks";

const Footer = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      bgcolor={theme.palette.background.paper}
      color={theme.palette.text.primary}
      py={6}
      px={4}
    >
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={4} textAlign="center">
          <Logo />
          <Stack
            direction="row"
            justifyContent="center"
            spacing={1}
            mt={1}
            aria-label={t("footerSocialMediaLinks")}
          >
            {SOCIAL_LINKS.map(({ icon, url, name }) => (
              <IconButton
                key={url}
                href={url}
                color="inherit"
                target="blank"
                rel="noopener noreferrer"
                aria-label={`${name} link`}
              >
                {icon}
              </IconButton>
            ))}
          </Stack>
        </Grid>

        <Grid
          item
          xs={12}
          sm={4}
          textAlign="center"
          component="section"
          aria-labelledby="about-heading"
        >
          <Typography variant="h6" fontWeight="bold" id="about-heading">
            {t("aboutUs")}
          </Typography>
          <Typography variant="body2">{t("footerAboutText")}</Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sm={4}
          textAlign="center"
          component="section"
          aria-labelledby="contact-heading"
        >
          <Typography variant="h6" fontWeight="bold" id="contact-heading">
            {t("contact")}
          </Typography>
          <Typography variant="body2" aria-label="email">
            kacper2007x48@gmail.com
          </Typography>
          <Typography variant="body2" aria-label="phone">
            +48 123 456 789
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="caption" textAlign="center" display="block">
        {t("footerAllRightsReserved", { year: new Date().getFullYear() })}
      </Typography>
      <Typography variant="caption" textAlign="center" display="block">
        {t("footerDesignedBy")}
      </Typography>
    </Box>
  );
};

export default Footer;
