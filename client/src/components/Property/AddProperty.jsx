import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  Paper,
  Grid,
  Box,
  Typography,
  FormControl,
  styled,
  Select,
  FormHelperText,
  Input,
  MenuItem,
  InputLabel,
} from "@mui/material";

import { useQuery, useMutation } from "@apollo/client";

//import methods from files
import Auth from "../../utils/auth";
import { QUERY_PROPERTIES_BY_USER } from "../../utils/queries";
// import global state
import { useComplaintContext } from "../../utils/GlobalState";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import { ADD_PROPERTY, UPDATE_PROPERTY } from "../../utils/mutations";
import { QUERY_USERS } from "../../utils/queries";
import {
  UPDATE_USERS,
  CLEAR_UPDATE_PROPERTY,
  CLEAR_CURRENT_SELECTED_ITEM,
} from "../../utils/actions";

//import react-google-maps/api for auto populated address field
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  fontWeight: "bold",
  width: "80%",
  background: "linear-gradient(to right ,#86AEAF,#457373, #457373,#86AEAF)",
}));
const placesLibrary = ["places"];
export default function AddProperty() {
  let owners,
    agents,
    tenants = [];
  let propertyId;
  const [searchResult, setSearchResult] = useState("Result: none");

  ///// code for auto populated address field ////////////
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_API_KEY,
    libraries: placesLibrary,
  });

  function onLoad(autocomplete) {
    setSearchResult(autocomplete);
  }

  function onPlaceChanged() {
    if (searchResult != null) {
      const place = searchResult.getPlace();
      setAddress(place.formatted_address);
    } else {
      console.log("Please Enter Address");
    }
  }
  ////////////////////////////////////////////////

  const [state, dispatch] = useComplaintContext();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { loading, data } = useQuery(QUERY_USERS);
  const [addProperty] = useMutation(ADD_PROPERTY, {
    refetchQueries: [QUERY_PROPERTIES_BY_USER, "propertiesByUser"],
    fetchPolicy: "network-only",
  });

  const [updateProperty] = useMutation(UPDATE_PROPERTY, {
    refetchQueries: [QUERY_PROPERTIES_BY_USER, "propertiesByUser"],
  });

  useEffect(() => {
    if (data) {
      //dispatches the action UPDATE_USERS to update the state with users
      dispatch({
        type: UPDATE_USERS,
        users: data.users,
      });
    }
  }, [loading, data, dispatch]);

  function filterUsers(role) {
    //returns users based on role
    return state.users.filter((user) => user.role === role);
  }
  tenants = filterUsers("tenant");
  owners = filterUsers("owner");
  agents = filterUsers("agent");

  let [owner, setOwner] = useState("");
  let [agent, setAgent] = useState("");
  let [tenant, setTenant] = useState("");
  let [address, setAddress] = useState("");
  let [errorMessage, setErrorMessage] = useState("");

  if (state.updateProperty) {
    const { id } = useParams();
    const selectedProperty = state.properties.find(
      (property) => property._id === id
    );

    [owner, setOwner] = useState(selectedProperty.owner._id);
    [agent, setAgent] = useState(selectedProperty.agent._id);
    [tenant, setTenant] = useState(selectedProperty.tenant._id);
    [address, setAddress] = useState(selectedProperty.address);
    propertyId = selectedProperty._id;
  }
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
  const handleOwnerChange = (event) => {
    setOwner(event.target.value);
  };
  const handleAgentChange = (event) => {
    setAgent(event.target.value);
  };
  const handleTenantChange = (event) => {
    setTenant(event.target.value);
  };
  const handleInputOnFocusOut = (e) => {
    const value = e.target.value;
    const temp = { ...errors };
    // check if the fields are invalid and set error message
    if (value) {
      temp.address = !address ? "Please enter address" : "";
      temp.owner = !owner ? "Please select owner" : "";
      temp.agent = !agent ? "Please select agent" : "";
      temp.tenant = !tenant ? "Please select tenant" : "";
    }
    //set error messages in errors
    setErrors({
      ...temp,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (validate()) {
        const property = {};
        (property.address = address),
          (property.owner = owner),
          (property.agent = agent),
          (property.tenant = tenant);

        if (Auth.loggedIn()) {
          //update property details
          if (state.updateProperty) {
            const response = await updateProperty({
              variables: {
                propertyDetails: property,
                propertyId: propertyId,
              },
            });
            dispatch({
              type: CLEAR_UPDATE_PROPERTY,
            });
          } else {
            //add property details
            const response = await addProperty({
              variables: {
                propertyDetails: property,
              },
            });

            dispatch({
              type: CLEAR_CURRENT_SELECTED_ITEM,
            });
          }
          navigate("/properties");
        }
      }
    } catch (error) {
      setErrorMessage("Something went wrong!");
    }
  };
  //function to  validate field
  const validate = () => {
    let temp = { ...errors };
    // check if the fields are entered and set error messages if empty
    temp.address = !address ? "Please enter address" : "";
    temp.owner = !owner ? "Please select owner" : "";
    temp.agent = !agent ? "Please select agent" : "";
    temp.tenant = !tenant ? "Please select tenant" : "";
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

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
            }}
          >
            <AddHomeWorkIcon />
          </Avatar>

          {state.updateProperty ? (
            <Typography component="h1" variant="h5">
              Update Property Details
            </Typography>
          ) : (
            <Typography component="h1" variant="h5">
              Enter Property Details
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
                <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
                  <InputLabel id="label-address" mb={10}>
                    Address
                  </InputLabel>
                  {/* auto populated address field */}
                  <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                    <Input
                      required
                      value={address}
                      type="text"
                      placeholder=""
                      style={{
                        boxSizing: `border-box`,
                        border: `1px  transparent`,
                        width: `100%`,
                        height: `48px`,
                        borderRadius: `3px`,
                        fontSize: `14px`,
                        outline: `none`,
                        textOverflow: `ellipses`,
                      }}
                      onChange={handleAddressChange}
                      onBlur={handleInputOnFocusOut}
                      error={errors.role ? true : false}
                    />
                  </Autocomplete>
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.address}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
                  <InputLabel id="label-role">Owner</InputLabel>
                  <Select
                    required
                    labelId="label-owner"
                    id="owner"
                    value={owner}
                    label="Owner"
                    name="owner"
                    onChange={handleOwnerChange}
                    onBlur={handleInputOnFocusOut}
                    error={errors.role ? true : false}
                  >
                    {owners.map((owner) => (
                      <MenuItem key={owner._id} value={owner._id}>
                        {owner.username}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.owner}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
                  <InputLabel id="label-role">Agent</InputLabel>
                  <Select
                    required
                    labelId="label-agent"
                    id="agent"
                    value={agent}
                    label="Agent"
                    name="agent"
                    onChange={handleAgentChange}
                    onBlur={handleInputOnFocusOut}
                    error={errors.role ? true : false}
                  >
                    {agents.map((agent) => (
                      <MenuItem key={agent._id} value={agent._id}>
                        {agent.username}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.agent}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
                  <InputLabel id="label-role">Tenant</InputLabel>
                  <Select
                    required
                    labelId="label-tenant"
                    id="tenant"
                    value={tenant}
                    label="Tenant"
                    name="tenant"
                    onChange={handleTenantChange}
                    onBlur={handleInputOnFocusOut}
                    error={errors.role ? true : false}
                  >
                    {tenants.map((tenant) => (
                      <MenuItem key={tenant._id} value={tenant._id}>
                        {tenant.username}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.tenant}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

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
