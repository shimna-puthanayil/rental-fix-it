import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import { useMutation } from "@apollo/client";
import Select from "@mui/material/Select";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

//import methods from files
import Auth from "../../../utils/auth";
import { UPDATE_COMPLAINT } from "../../../utils/mutations";
import { QUERY_COMPLAINTS_RAISED } from "../../../utils/queries";
// import global state
import { useComplaintContext } from "../../../utils/GlobalState";
import Quotes from "../../Quotes";
import { CLEAR_QUOTES, CLEAR_UPDATE_COMPLAINT } from "../../../utils/actions";

const ColorButton = styled(Button)(({}) => ({
  color: "white",
  fontWeight: "bold",
  width: "80%",
  background: "linear-gradient(to right ,#86AEAF,#457373, #457373,#86AEAF)",
}));

export default function ComplaintDetails() {
  const [state, dispatch] = useComplaintContext();
  const complaintPictureUrls = state.selectedComplaint.picUrl;
  // let [complaintPictureUrls, setComplaintPictureUrls] =
  //   useState(savedPictureUrls);

  const navigate = useNavigate();
  const [updateComplaint] = useMutation(UPDATE_COMPLAINT, {
    refetchQueries: [QUERY_COMPLAINTS_RAISED, "complaintsRaised"],
  });

  const [status, setStatus] = useState(state.selectedComplaint.status);
  const [errorMessage, setErrorMessage] = useState("");
  const complaintId = state.selectedComplaint.id;
  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // const data = new FormData(event.currentTarget);
      if (Auth.loggedIn()) {
        //get quotes from state and update complaint
        const quotes = state.quotes;
        const suggestedQuotes = [];
        for (let i = 0; i < quotes.length; i++) {
          const quote = {};
          (quote.businessName = quotes[i].name),
            (quote.address = quotes[i].address),
            (quote.quote = quotes[i].quote.toString()),
            suggestedQuotes.push(quote);
        }
        const response = await updateComplaint({
          variables: {
            quotes: suggestedQuotes,
            status: status,
            complaintId: complaintId,
            complaint: "",
          },
        });
        dispatch({
          type: CLEAR_QUOTES,
          quotes: [],
        });
        dispatch({
          type: CLEAR_UPDATE_COMPLAINT,
        });
        navigate("/profile");
      }
    } catch (error) {
      setErrorMessage("Please enter required fields");
    }
  };
  //breakpoints for image list
  const PictureList = styled(ImageList)(({ theme }) => ({
    padding: theme.spacing(1),
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  }));
  return (
    <Grid
      container
      component="main"
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CssBaseline />

      <Grid
        item
        xs={12}
        sm={8}
        md={10}
        component={Paper}
        elevation={6}
        square
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              backgroundImage: `linear-gradient(to bottom,#86AEAF,#457373,#86AEAF)`,
              width: 56,
              height: 56,
              m: 1,
              bgcolor: "#457373",
            }}
          >
            <SpeakerNotesIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Complaint
          </Typography>
          <Typography component="h5">{state.selectedComplaint.date}</Typography>
          <Box
            width={"80%"}
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={10}>
              <Grid item xs={12}>
                <FormControl sx={{ m: 1 }} fullWidth>
                  <TextField
                    value={state.selectedComplaint.address}
                    onChange={(e) => setComplaint(e.target.value)}
                    id="standard-multiline-static"
                    label="Address"
                    name="address"
                    multiline
                    variant="standard"
                    aria-readonly
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ m: 1 }} fullWidth>
                  <TextField
                    value={state.selectedComplaint.complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    id="standard-multiline-static"
                    label="Complaint"
                    name="complaint"
                    multiline
                    variant="standard"
                  />
                </FormControl>
              </Grid>
              {complaintPictureUrls.length ? (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Typography ml={1} color={"gray"}>
                      Images
                    </Typography>

                    <PictureList
                      sx={{
                        width: "auto",
                        height: 218,
                      }}
                      cols={6}
                      rowHeight={200}
                    >
                      {complaintPictureUrls.map((file) => (
                        <ImageListItem key={file}>
                          <img
                            srcSet={`${file}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            src={`${file}?w=164&h=164&fit=crop&auto=format`}
                            alt={file}
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                    </PictureList>
                  </FormControl>
                </Grid>
              ) : (
                <></>
              )}
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
                  <InputLabel id="label-role">Status</InputLabel>
                  <Select
                    required
                    labelId="label-status"
                    id="status"
                    value={status}
                    label="Status"
                    name="status"
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"open"}>Open</MenuItem>
                    <MenuItem value={"in progress"}>In Progress</MenuItem>
                    <MenuItem value={"resolved"}>Resolved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ m: 1 }} fullWidth>
                  <TextField
                    value={state.selectedComplaint.approvedQuote}
                    id="standard-multiline-static"
                    label="Approved Quote"
                    name="quotes"
                    multiline
                    variant="standard"
                    aria-readonly
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                {/*" Grid Of quotes "*/}
                <Quotes />
              </Grid>
            </Grid>

            <ColorButton
              type="submit"
              variant="contained"
              sx={{
                mt: 4,
                mb: 5,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              Submit
            </ColorButton>
          </Box>
        </Box>
        {/* if state of error message changes */}
        {errorMessage && (
          <Typography ml={4} color="red">
            {errorMessage}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
