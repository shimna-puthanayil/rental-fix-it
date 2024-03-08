import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { LOGIN } from "../../utils/mutations";
import { validateEmail } from "../../utils/helpers";
import { styled } from "@mui/material/styles";

const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  fontWeight: "bold",
  background: "linear-gradient(to right ,#86AEAF,#457373, #457373,#86AEAF)",
}));
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        FixIt
      </Link>
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignIn() {
  const [login] = useMutation(LOGIN);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [formState, setFormState] = useState({ email: "", password: "" });
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = new FormData(event.currentTarget);
      if (validate(data)) {
        const response = await login({
          variables: {
            email: data.get("email"),
            password: data.get("password"),
          },
        });

        const token = response.data.login.token;
        const role = response.data.login.user.role;
        Auth.login(token);
        data.set("email", "");
        data.set("password", "");
      }
    } catch (error) {
      setErrorMessage(
        "The username or password that you've entered is incorrect."
      );
    }
  };
  const handleInput = (e) => {
    const type = e.target.name;
    const value = e.target.value;
    // set value of selected field
    if (type === "email" || type === "password") {
      setFormState({ ...formState, [type]: value });
    }
  };
  const handleInputOnFocusOut = (e) => {
    const type = e.target.name;
    const value = e.target.value;
    const temp = { ...errors };
    // check if the email is invalid and set error message
    if (value) {
      temp.email =
        type === "email" && !validateEmail(value)
          ? "Please enter valid email address"
          : "";
    }
    //set error messages in errors
    setErrors({
      ...temp,
    });
  };
  //function to  validate fields
  const validate = (data) => {
    let temp = { ...errors };
    // check if the email is invalid and set error message
    temp.email = !validateEmail(data.get("email"))
      ? "Please enter valid email address"
      : "";
    // check if the password length is less than 8 and set error message
    if (data.get("password"))
      temp.password =
        data.get("password").length < 8
          ? "Password should be minimum of 8 characters"
          : "";
    // check if the password is empty
    else
      temp.password =
        data.get("password") != "" ? "" : "Please enter password .";
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={8}
        sx={{
          backgroundImage: `url("/images/login.png")`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 25,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              backgroundImage: `linear-gradient(to right,#457373,#6E9B9B,#457373)`,
              bgcolor: "#457373",
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              fullWidth
              value={formState.email}
              margin="normal"
              required
              id="email"
              label="Email Address"
              type="email"
              name="email"
              autoComplete="email"
              onChange={handleInput}
              onBlur={handleInputOnFocusOut}
              error={errors.email ? true : false}
              helperText={errors.email}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onBlur={handleInputOnFocusOut}
              error={errors.password ? true : false}
              helperText={errors.password}
            />

            <ColorButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </ColorButton>
            {/* if state of error message changes */}
            {errorMessage && (
              <Stack>
                <Typography fontSize={"1xl"} color={"red"}>
                  {errorMessage}
                </Typography>
              </Stack>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signup" variant="body2" sx={{ color: "#457373" }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
