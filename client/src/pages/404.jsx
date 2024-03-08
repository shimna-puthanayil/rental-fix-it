import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import {
  Box,
  Button,
  Container,
  SvgIcon,
  Typography,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Auth from "../utils/auth";
const ColorButton = styled(Button)(({}) => ({
  color: "white",
  fontWeight: "bold",
  background: "linear-gradient(to right ,#86AEAF,#457373, #457373,#86AEAF)",
}));
const Page = () => {
  let page = "";
  if (Auth.loggedIn()) page = "/profile";
  else page = "/signin";
  return (
    <>
      <Typography variant="h1" component="h1">
        <title>404 | FixIt</title>
      </Typography>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                mt: 20,
                mb: 3,
                textAlign: "center",
              }}
            >
              <img
                alt="not found"
                src="/images/no-data.png"
                style={{
                  display: "inline-block",
                  maxWidth: "100%",
                  width: 400,
                }}
              />
            </Box>
            <Typography align="center" sx={{ mb: 3 }} variant="h3">
              404: The page you are looking for isn’t here
            </Typography>
            <Typography align="center" color="text.secondary" variant="body1">
              You either tried some shady route or you came here by mistake.
              Whichever it is, try using the navigation
            </Typography>
            {}
            <ColorButton
              component={Link}
              href={page}
              startIcon={
                <SvgIcon fontSize="small">
                  <ArrowCircleLeftIcon />
                </SvgIcon>
              }
              sx={{ mt: 3 }}
              variant="contained"
            >
              Go back to dashboard
            </ColorButton>
          </Box>
        </Container>
      </Box>
    </>
  );
};
export default Page;
