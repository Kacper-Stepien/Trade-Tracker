import {
  Grid,
  IconButton,
  Stack,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useTheme } from "../hooks/useTheme";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Logo from "./ui/Logo";

const Footer = () => {
  const { theme } = useTheme();

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
          <Stack direction="row" justifyContent="center" spacing={1} mt={1}>
            <IconButton
              href="https://github.com/Kacper-Stepien"
              color="inherit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              href="https://www.linkedin.com/in/kacper-st%C4%99pie%C5%84/"
              color="inherit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              href="https://www.facebook.com/kacper.stepien.509/"
              color="inherit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="https://www.instagram.com/kacper2076/"
              color="inherit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              href="https://twitter.com"
              color="inherit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon />
            </IconButton>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={4} textAlign="center">
          <Typography variant="h6" fontWeight="bold">
            O nas
          </Typography>
          <Typography variant="body2">
            Trade Tracker to narzędzie do śledzenia transakcji kupna i
            sprzedaży. Dodawaj produkty, rejestruj koszty, a następnie monitoruj
            zyski dzięki przejrzystym podsumowaniom i wykresom.
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4} textAlign="center">
          <Typography variant="h6" fontWeight="bold">
            Kontakt
          </Typography>
          <Typography variant="body2">kacper2007x48@gmail.com</Typography>
          <Typography variant="body2">+48 123 456 789</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="caption" textAlign="center" display="block">
        © {new Date().getFullYear()} Trade Tracker. All rights reserved.
      </Typography>
      <Typography variant="caption" textAlign="center" display="block">
        © Designed by Kacper Stępień.
      </Typography>
    </Box>
  );
};

export default Footer;
