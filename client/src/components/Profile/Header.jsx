import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
// import theme from "../styles/theme";
import Auth from "../../utils/auth";
import { styled } from "@mui/material/styles";
// import global state
import { useComplaintContext } from "../../utils/GlobalState";
import { UPDATE_ROLE } from "../../utils/actions";
import AccountPopover from "../Profile/AccountPopOver";
import { usePopover } from "../Profile/UsePopOver";
const ColorBar = styled(AppBar)(({ theme }) => ({
  color: "white",
  background:
    "linear-gradient(to right ,#457373,#7FA6A6, #B2C9CB,#7FA6A6,#487B7B)",
}));
function Header(props) {
  const accountPopover = usePopover();
  const { onDrawerToggle } = props;
  const [state, dispatch] = useComplaintContext();
  let title,
    role = "";

  if (Auth.loggedIn) {
    role = Auth.getProfile().data.role;
    useEffect(() => {
      dispatch({
        type: UPDATE_ROLE,
        role: role,
      });
    }, [dispatch]);
    //sets the title in header according to  components that will be rendered on different conditions
    if (state.updateComplaint || state.updateProperty) title = "";
    else if (state.selectedItem) title = state.selectedItem;
    else if (state.role === "admin") title = "Properties";
    else if (role === "tenant") title = "My Complaints";
    else title = "Open";
  }
  const ColorAvatar = styled(Avatar)(({ theme }) => ({
    background: "linear-gradient(to right ,#457373, #B2C9CB,#457373)",
  }));
  return (
    <React.Fragment>
      <ColorBar position="sticky" elevation={0} sx={{ height: 80 }}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid sx={{ display: { sm: "none", xs: "block" } }} item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs></Grid>

            <Grid item xs />

            <Grid item mr={3} mt={2}>
              <IconButton
                color="inherit"
                sx={{ p: 0.5 }}
                onClick={accountPopover.handleOpen}
              >
                <Avatar
                  ref={accountPopover.anchorRef}
                  sx={{
                    bgcolor: "#7FA6A6",
                    cursor: "pointer",
                    height: 40,
                    width: 40,
                  }}
                />
              </IconButton>
              <AccountPopover
                anchorEl={accountPopover.anchorRef.current}
                open={accountPopover.open}
                onClose={accountPopover.handleClose}
              />
            </Grid>
          </Grid>
        </Toolbar>
      </ColorBar>
      <ColorBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="white" variant="h5" component="h1" mb={3}>
                <strong>{title}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </ColorBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;
