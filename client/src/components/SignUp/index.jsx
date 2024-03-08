import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";
import { FormControl, FormHelperText } from "@mui/material";
import { useMutation } from "@apollo/client";
//import methods from files
import Auth from "../../utils/auth";
import { ADD_USER } from "../../utils/mutations";
import { validateEmail } from "../../utils/helpers";
const ColorButton = styled(Button)(({}) => ({
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
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignUp() {
  const [addUser] = useMutation(ADD_USER);
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
  });
  const handleChange = (event) => {
    setRole(event.target.value);
    const temp = { ...errors };
    // check if the role is selected
    temp.role = role ? "" : "Please select a role";
    //set error messages in errors
    setErrors({
      ...temp,
    });
  };
  const handleInputOnFocusOut = (e) => {
    const type = e.target.name;
    const value = e.target.value;
    const temp = { ...errors };
    // check if the user name is empty
    temp.name =
      type === "username" && !data.get("name")
        ? "Please enter the name of the user"
        : "";
    // check if the email is invalid and set error message
    if (value) {
      temp.email =
        type === "email" && !validateEmail(value)
          ? "Please enter valid email address"
          : "";
      // check if the password length is less than 8 and set error message
      temp.password =
        type === "password" && value.length < 8
          ? "Password should be minimum of 8 characters"
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
    // check if the user name is empty
    temp.name = !data.get("name") ? "Please enter the name of the user" : "";
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
    // check if the role is selected
    temp.role = role ? "" : "Please select a role";

    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };
  const handleInput = (e) => {
    const type = e.target.name;
    const value = e.target.value;

    // set value of selected field
    if (type === "email" || type === "password" || type === "username") {
      setFormState({ ...formState, [type]: value });
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      if (validate(data)) {
        const response = await addUser({
          variables: {
            email: data.get("email"),
            password: data.get("password"),
            username: data.get("name"),
            role: role,
          },
        });

        if (response.data?.addUser === null) {
          setErrorMessage("There is already an account in this mail id");
          return;
        }
        const token = response.data.addUser.token;
        Auth.login(token);
        data.set("email", "");
        data.set("password", "");
        data.set("name", "");
        data.set("role", "");
      }
    } catch (error) {
      setErrorMessage("Something went wrong");
    }
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
          backgroundImage: `url("./images/login.png")`,
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
            marginTop: 25,
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="dense"
              autoComplete="given-name"
              name="name"
              type="username"
              required
              fullWidth
              id="name"
              label="name"
              autoFocus
              onChange={handleInput}
              onBlur={handleInputOnFocusOut}
              error={errors.name ? true : false}
              helperText={errors.name}
            />

            <TextField
              margin="dense"
              required
              fullWidth
              value={formState.email}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={handleInput}
              onBlur={handleInputOnFocusOut}
              error={errors.email ? true : false}
              helperText={errors.email}
            />

            <TextField
              margin="dense"
              required
              fullWidth
              value={formState.password}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              onChange={handleInput}
              onBlur={handleInputOnFocusOut}
              error={errors.password ? true : false}
              helperText={errors.password}
            />
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="label-role">Role</InputLabel>
              <Select
                margin="dense"
                fullWidth
                required
                labelId="label-role"
                id="role"
                value={role}
                label="Role"
                name="role"
                onChange={handleChange}
                error={errors.role ? true : false}
              >
                <MenuItem value={"agent"}>Agent</MenuItem>
                <MenuItem value={"owner"}>Owner</MenuItem>
                <MenuItem value={"tenant"}>Tenant</MenuItem>
              </Select>
              <FormHelperText sx={{ color: "red" }}>
                {errors.role}
              </FormHelperText>
            </FormControl>
            <ColorButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </ColorButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2" sx={{ color: "#457373" }}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* if state of error message changes */}
        {errorMessage && (
          <Typography ml={4} color="red">
            {errorMessage}
          </Typography>
        )}
        <Copyright sx={{ mt: 5 }} />
      </Grid>
    </Grid>
  );
}
