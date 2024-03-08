import * as React from "react";
import { useMediaQuery } from "@mui/material";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import PermMediaOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActual";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Typography from "@mui/material/Typography";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Avatar from "@mui/material/Avatar";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import {
  CURRENT_SELECTED_ITEM,
  CLEAR_UPDATE_COMPLAINT,
  CLEAR_UPDATE_PROPERTY,
} from "../../utils/actions";
// import global state
import { useComplaintContext } from "../../utils/GlobalState";
import { useNavigate } from "react-router-dom";
import auth from "../../utils/auth";
let categories = [
  {
    id: "Complaints",
    children: [
      { id: "Open", icon: <FiberNewIcon /> },
      { id: "In Progress", icon: <PermMediaOutlinedIcon /> },
      { id: "Resolved", icon: <AssignmentTurnedInIcon /> },
    ],
  },
  {
    id: "Properties",
    children: [{ id: "Houses", icon: <HomeIcon /> }],
  },
];

const categoriesForTenants = [
  {
    id: "Complaints",
    children: [
      { id: "My Complaints", icon: <QuestionAnswerIcon /> },
      { id: "Add Complaint", icon: <NoteAddIcon /> },
    ],
  },
];
const categoriesForAdmin = [
  {
    id: "Properties",
    children: [
      { id: "Add Property", icon: <AddHomeWorkIcon /> },
      { id: "Properties", icon: <HomeIcon /> },
    ],
  },
];
const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

export default function Navigator(props) {
  const navigate = useNavigate();
  const { onClose, ...other } = props;
  const [state, dispatch] = useComplaintContext();
  // click event for items on navigation bar
  const handleClick = async (childId) => {
    dispatch({
      type: CURRENT_SELECTED_ITEM,
      selectedItem: childId,
    });
    if (!auth.loggedIn()) {
      navigate("/signin");
    }
    dispatch({
      type: CLEAR_UPDATE_COMPLAINT,
    });
    dispatch({
      type: CLEAR_UPDATE_PROPERTY,
    });
    if (childId === "Properties" || childId === "Houses")
      navigate("/properties");
    // if (state.selectedComplaint || childId === "Add Property")
    else navigate("/profile");
  };

  if (state.role === "tenant") categories = categoriesForTenants;
  if (state.role === "admin") categories = categoriesForAdmin;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding onClick={onClose}>
        {/* Logo  */}
        <ListItem
          sx={{ ...item, ...itemCategory, fontSize: 12, color: "#fff" }}
        >
          <Avatar
            alt="logo"
            src="/images/logo.png"
            sx={{ width: 56, height: 56 }}
            ml={2}
          />
          <Typography
            variant="h5"
            display="block"
            color={"#86AEAF"}
            fontWeight={"bold"}
            fontFamily={"Alice"}
            ml={2}
            align="left"
            sx={{
              backgroundImage: `linear-gradient(to bottom,#B2C9CB,#6E9B9B,#B2C9CB)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            FixIt
          </Typography>
        </ListItem>

        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: "#101F33" }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: "#fff" }}>
                <strong>{id}</strong>
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active }) => (
              <ListItem
                disablePadding
                key={childId}
                sx={{ fontSize: 14, fontWeight: 600 }}
              >
                <ListItemButton
                  selected={active}
                  sx={item}
                  onClick={() => handleClick(childId)}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText sx={{ fontSize: 30 }}>
                    <strong> {childId}</strong>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
