import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
} from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import LoopIcon from "@mui/icons-material/Loop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Grid from "@mui/material/Grid";
import { useQuery } from "@apollo/client";
import { styled } from "@mui/material/styles";
import { QUERY_COMPLAINTS_RAISED } from "../../utils/queries";
import { Container, Tooltip, Typography, tooltipClasses } from "@mui/material";
import {
  UPDATE_COMPLAINTS,
  SELECTED_COMPLAINT,
  CLEAR_CURRENT_SELECTED_ITEM,
  UPDATE_COMPLAINT,
} from "../../utils/actions";
import { useEffect } from "react";
// import global state
import { useComplaintContext } from "../../utils/GlobalState";
import AddComplaint from "../Complaint/AddComplaint";
import { useNavigate } from "react-router-dom";
import AddProperty from "../Property/AddProperty";
import Properties from "../../pages/Properties";
import auth from "../../utils/auth";

const Root = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1),
  [theme.breakpoints.down("md")]: {
    maxWidth: 300,
  },
  [theme.breakpoints.up("md")]: {
    maxWidth: 500,
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: "100%",
  },
}));

export default function Content() {
  const navigate = useNavigate();
  if (!auth.loggedIn()) {
    navigate(`/`);
  }
  const [state, dispatch] = useComplaintContext();
  let dateColumnWidth = 150,
    statusColumnWidth = 150,
    addressColumnWidth = 300;
  if (state.role === "tenant") {
    dateColumnWidth = 350;
    statusColumnWidth = 330;
    addressColumnWidth = 400;
  }
  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 900,
      height: 50,
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));
  const columns = [
    {
      renderHeader: () => <strong>{"Address "}</strong>,
      field: "address",
      headerClassName: "super-app-theme--header",
      headerName: "Address",
      width: addressColumnWidth,
      minWidth: 150,
      renderCell: (params) => (
        <BootstrapTooltip
          title={
            <Typography fontSize={13}>Click to view / edit details</Typography>
          }
          followCursor
        >
          <span>{params.value}</span>
        </BootstrapTooltip>
      ),
    },
    {
      renderHeader: () => <strong>{"Complaint "}</strong>,
      field: "complaint",
      headerName: "Complaint",
      width: 502,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <BootstrapTooltip
          title={
            <Typography fontSize={13}>Click to view / edit details</Typography>
          }
          followCursor
        >
          <span>{params.value}</span>
        </BootstrapTooltip>
      ),
    },
    {
      renderHeader: () => <strong>{"Date "}</strong>,
      field: "date",
      headerName: "Date",
      width: dateColumnWidth,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <BootstrapTooltip
          title={
            <Typography fontSize={13}>Click to view / edit details</Typography>
          }
          followCursor
        >
          <span>{params.value}</span>
        </BootstrapTooltip>
      ),
    },
    {
      renderHeader: () => <strong>{"  Status "}</strong>,
      field: "status",
      headerName: "Status",
      width: statusColumnWidth,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <BootstrapTooltip
          title={
            <Typography fontSize={13}>Click to view / edit details</Typography>
          }
          followCursor
        >
          <span>
            {params.value === "open" ? (
              <ListItem sx={{ padding: 0 }}>
                <ListItemIcon>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: "#9F1D1D" }}>
                    <NewReleasesIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText> Open</ListItemText>
              </ListItem>
            ) : params.value === "in progress" ? (
              <ListItem sx={{ padding: 0 }}>
                <ListItemIcon>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: "#CD8820" }}>
                    <LoopIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText> In Progress</ListItemText>
              </ListItem>
            ) : (
              <ListItem sx={{ padding: 0 }}>
                <ListItemIcon>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: "#457373" }}>
                    <CheckCircleIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText> Resolved</ListItemText>
              </ListItem>
            )}
          </span>
        </BootstrapTooltip>
      ),
    },

    {
      renderHeader: () => <strong>{"Approved Quote "}</strong>,
      field: "approvedQuote",
      headerName: "Quote",
      headerClassName: "super-app-theme--header",
      width: 465,
      editable: true,
      renderCell: (params) => (
        <BootstrapTooltip
          title={
            <Typography fontSize={13}>Click to view / edit details</Typography>
          }
          followCursor
        >
          <span>{params.value}</span>
        </BootstrapTooltip>
      ),
    },
  ];

  let status = "open";
  if (state.selectedItem) {
    status = state.selectedItem.toLowerCase();
  }
  let complaints = [],
    comps = [];

  const { loading, data } = useQuery(QUERY_COMPLAINTS_RAISED, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data) {
      //dispatches the action UPDATE_COMPLAINTS to update the state with new complaints
      dispatch({
        type: UPDATE_COMPLAINTS,
        complaints: data.complaintsRaised,
      });
    }
  }, [loading, data, dispatch]);

  function filterComplaints() {
    //returns complaints based on status( for owner and agent login)
    return state.complaints.filter((complaint) => complaint.status === status);
  }
  function filterComplaintsForTenants() {
    //returns  complaints raised by tenants with status in progress or open
    return state.complaints.filter(
      (complaint) =>
        complaint.status === "open" || complaint.status === "in progress"
    );
  }
  if (state.role === "tenant") complaints = filterComplaintsForTenants();
  else complaints = filterComplaints();

  for (let i = 0; i < complaints.length; i++) {
    const comp = {};
    (comp.id = i + 1),
      (comp.id = complaints[i]._id),
      (comp.complaint = complaints[i].complaint),
      (comp.address = complaints[i].property.address),
      (comp.date = new Date(parseInt(complaints[i].date)).toLocaleDateString()),
      (comp.status = complaints[i].status),
      (comp.approvedQuote = complaints[i].approvedQuote),
      (comp.picUrl = complaints[i].picUrl),
      comps.push(comp);
  }
  const rows = comps;
  if (rows.length === 0) {
    return (
      <>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexGrow: 1,
          }}
        >
          <Container>
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
                  alt="no data"
                  src="/images/no-data.png"
                  style={{
                    display: "inline-block",
                    maxWidth: "50%",
                    width: 300,
                  }}
                />
              </Box>
              <Typography align="center" sx={{ mb: 3 }} variant="h6">
                There are no complaints
              </Typography>
            </Box>
          </Container>
        </Box>
      </>
    );
  } else {
    let clickedId = "";
    //click event of grid( when a particular complaint is clicked )
    const handleRowClick = (params) => {
      dispatch({
        type: SELECTED_COMPLAINT,
        selectedComplaint: { ...params.row },
      });
      dispatch({
        type: CLEAR_CURRENT_SELECTED_ITEM,
        selectedItem: "",
      });
      dispatch({
        type: UPDATE_COMPLAINT,
        updateComplaint: true,
      });
      clickedId = params.row.id;
      // if (state.role === "agent") navigate(`/complaint/${clickedId}`);
      switch (state.role) {
        case "agent":
          navigate(`/complaint/${clickedId}`);
          break;
        case "tenant":
          navigate(`/update/complaint/${clickedId}`);
          break;
        case "owner":
          navigate(`/approve/complaint/${clickedId}`);
          break;
        default:
          break;
      }
    };

    if (state.selectedItem === "Add Complaint") return <AddComplaint />;
    else if (state.selectedItem === "Add Property") return <AddProperty />;
    else if (state.selectedItem === "Properties") return <Properties />;
    else if (state.updateComplaint) return <AddComplaint />;
    else if (state.role === "tenant")
      return (
        <Root container>
          <Grid item xs={12} md={12} lg={12} component={Paper} elevation={2}>
            <Box
              sx={{
                minWidth: 100,
                height: "100%",
                width: "100%",
                "& .super-app-theme--header": {
                  backgroundColor: "#101F33",
                  color: "white",
                },
              }}
            >
              <DataGrid
                disableColumnMenu
                getRowClassName={(params) =>
                  `super-app-theme--${params.row.status}`
                }
                onRowClick={handleRowClick}
                rows={rows}
                columns={columns}
                columnVisibilityModel={{
                  // Hide columns property and quotes, the other columns will remain visible
                  approvedQuote: false,
                  property: false,
                }}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
            </Box>
          </Grid>
        </Root>
      );
    else
      return (
        <Root container>
          <Grid item xs={12} md={12} lg={12} component={Paper} elevation={2}>
            <Box
              sx={{
                minWidth: 100,
                height: "100%",
                width: "100%",
                "& .super-app-theme--header": {
                  backgroundColor: "#101F33",
                  color: "white",
                },
              }}
            >
              <DataGrid
                sx={{ backgroundColor: "#F6F6F6" }}
                disableColumnMenu
                getRowClassName={(params) =>
                  `super-app-theme--${params.row.status}`
                }
                onRowClick={handleRowClick}
                rows={rows}
                columns={columns}
                columnVisibilityModel={{
                  // Hide column property, the other columns will remain visible

                  property: false,
                }}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 15,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
            </Box>
          </Grid>
        </Root>
      );
  }
}
