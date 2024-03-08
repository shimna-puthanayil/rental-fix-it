import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useMutation } from "@apollo/client";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import axios from "axios";
//import methods from files
import Auth from "../../../utils/auth";
import {
  CLEAR_UPDATE_COMPLAINT,
  CLEAR_CURRENT_SELECTED_ITEM,
} from "../../../utils/actions";
import {
  ADD_COMPLAINT,
  UPDATE_COMPLAINT,
  S3Sign,
} from "../../../utils/mutations";
import { QUERY_COMPLAINTS_RAISED } from "../../../utils/queries";
// import global state
import { useComplaintContext } from "../../../utils/GlobalState";
const ColorButton = styled(Button)(({}) => ({
  color: "white",
  fontWeight: "bold",
  width: "80%",
  background: "linear-gradient(to right ,#86AEAF,#457373, #457373,#86AEAF)",
}));

export default function AddComplaint() {
  const [state, dispatch] = useComplaintContext();
  let savedPictureUrls = [];
  if (state.updateComplaint) {
    savedPictureUrls = state.selectedComplaint.picUrl;
  }
  let [complaintPictureUrls, setComplaintPictureUrls] =
    useState(savedPictureUrls);
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const navigate = useNavigate();
  const [addComplaint] = useMutation(ADD_COMPLAINT, {
    refetchQueries: [QUERY_COMPLAINTS_RAISED, "complaintsRaised"],
  });
  const [updateComplaint] = useMutation(UPDATE_COMPLAINT, {
    refetchQueries: [QUERY_COMPLAINTS_RAISED, "complaintsRaised"],
  });
  const [s3Sign] = useMutation(S3Sign);
  let [complaint, setComplaint] = useState("");
  if (state.updateComplaint) {
    [complaint, setComplaint] = useState(state.selectedComplaint.complaint);
  }
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const handleInputOnFocusOut = (e) => {
    const value = e.target.value;
    const temp = { ...errors };
    // check if the complaint is invalid and set error message
    if (value) {
      temp.complaint = !value ? "Please enter complaint" : "";
    }
    //set error messages in errors
    setErrors({
      ...temp,
    });
  };
  //function to  validate field
  const validate = () => {
    let temp = { ...errors };
    // check if the complaint is entered and set error message if empty
    temp.complaint = !complaint ? "Please enter complaint" : "";
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };
  //click event of submit button
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (Auth.loggedIn()) {
        if (validate()) {
          //update complaint

          if (state.updateComplaint) {
            for (let i = 0; i < files.length; i++) {
              const responseS3 = await s3Sign({
                variables: {
                  filename: formatFilename(files[i].name),
                  filetype: files[i].type,
                },
              });
              setComplaintPictureUrls(
                (complaintPictureUrls = [
                  ...complaintPictureUrls,
                  responseS3.data.s3Sign.url,
                ])
              );
              const options = {
                headers: {
                  "Content-Type": files[i].type,
                },
              };
              //save image to s3
              await axios.put(
                responseS3.data.s3Sign.signedRequest,
                files[i],
                options
              );
            }
            const response = await updateComplaint({
              variables: {
                complaint: complaint,
                quotes: [],
                status: "",
                complaintId: state.selectedComplaint.id,
                picUrl: complaintPictureUrls,
              },
            });
            dispatch({
              type: CLEAR_UPDATE_COMPLAINT,
            });
          } else {
            //add new complaint
            for (let i = 0; i < files.length; i++) {
              const responseS3 = await s3Sign({
                variables: {
                  filename: formatFilename(files[i].name),
                  filetype: files[i].type,
                },
              });
              setComplaintPictureUrls(
                (complaintPictureUrls = [
                  ...complaintPictureUrls,
                  responseS3.data.s3Sign.url,
                ])
              );
              const options = {
                headers: {
                  "Content-Type": files[i].type,
                },
              };
              //save image to s3
              await axios.put(
                responseS3.data.s3Sign.signedRequest,
                files[i],
                options
              );
            }
            const response = await addComplaint({
              variables: {
                complaint: complaint,
                picUrl: complaintPictureUrls,
              },
            });

            dispatch({
              type: CLEAR_CURRENT_SELECTED_ITEM,
            });

            setComplaint("");
            navigate("/profile");
          }
        }
      }
    } catch (error) {
      setErrorMessage("Please enter required fields");
    }
  };
  //formats the file name to make it unique before storing into s3
  const formatFilename = (filename) => {
    const randomString = Math.random().toString(36).substring(2, 7);
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newFilename = `complaint-images/${randomString}-${cleanFileName}`;
    return newFilename.substring(0, 60);
  };
  //removes attached/saved image from image list
  const removePicture = (fileToDelete) => {
    //on click of delete button over attached image( to be saved)
    if (fileToDelete.preview) {
      const attachedFilesAfterDelete = files.filter(
        (file) => file != fileToDelete
      );
      setFiles(attachedFilesAfterDelete);
    } else {
      //on click of delete button over saved image
      const savedUrlsAfterDelete = complaintPictureUrls.filter(
        (file) => file != fileToDelete
      );
      setComplaintPictureUrls(savedUrlsAfterDelete);
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
        sm={12}
        md={12}
        component={Paper}
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
          <Avatar sx={{ m: 1, bgcolor: "#457373" }}>
            <DriveFileRenameOutlineIcon />
          </Avatar>

          {state.updateComplaint ? (
            <Typography component="h1" variant="h5">
              Update Complaint{" "}
            </Typography>
          ) : (
            <Typography component="h1" variant="h5">
              Raise A Complaint{" "}
            </Typography>
          )}

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
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    id="standard-multiline-static"
                    label="Complaint"
                    name="complaint"
                    multiline
                    variant="standard"
                    onBlur={handleInputOnFocusOut}
                    error={errors.complaint ? true : false}
                    helperText={errors.complaint}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              {...getRootProps()}
              border="thin dashed"
              borderColor={"#c7c7c7"}
              ml={1}
              mt={2}
              mb={5}
            >
              <input {...getInputProps()} />
              <Grid item xs={12} p={4} textAlign={"center"}>
                <CloudUploadIcon sx={{ color: "#457373" }} />
                <Typography>
                  {"Drag 'n' drop some files here, or click to select files"}
                </Typography>
              </Grid>
            </Grid>
            {/*    Pictures to upload   */}
            {files.length ? (
              <PictureList
                sx={{
                  width: "auto",
                  height: 250,
                  ml: 1,
                }}
                cols={6}
                rowHeight={200}
              >
                {files.map((file) => (
                  <ImageListItem key={file.preview}>
                    <img
                      width={200}
                      height={200}
                      background="no-repeat center"
                      src={file.preview}
                      // Revoke data url after image is loaded
                    />
                    <ImageListItemBar
                      sx={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, " +
                          "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                      }}
                      position="top"
                      actionIcon={
                        <IconButton
                          onClick={() => removePicture(file)}
                          sx={{ color: "#C44848" }}
                          aria-label={`delete ${file}`}
                        >
                          <HighlightOffRoundedIcon />
                        </IconButton>
                      }
                      actionPosition="left"
                    />
                  </ImageListItem>
                ))}
              </PictureList>
            ) : (
              <></>
            )}
            <ColorButton
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              Submit
            </ColorButton>
            {state.updateComplaint && complaintPictureUrls.length ? (
              <Typography component="h5" variant="h6" ml={1}>
                Images
              </Typography>
            ) : (
              <></>
            )}
            {/*   Saved Pictures  */}
            <PictureList
              sx={{
                width: "auto",
                height: 250,
                ml: 1,
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
                  <ImageListItemBar
                    sx={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, " +
                        "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                    }}
                    position="top"
                    actionIcon={
                      <IconButton
                        onClick={() => removePicture(file)}
                        sx={{ color: "#C44848" }}
                        aria-label={`delete ${file}`}
                      >
                        <HighlightOffRoundedIcon />
                      </IconButton>
                    }
                    actionPosition="left"
                  />
                </ImageListItem>
              ))}
            </PictureList>
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
