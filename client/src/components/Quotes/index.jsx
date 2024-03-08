import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Fab from "@mui/material/Fab";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { UPDATE_QUOTES } from "../../utils/actions";
// import global state
import { useComplaintContext } from "../../utils/GlobalState";

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, name: "", address: "", isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <ColorButton
        sx={{ ":hover": { background: "white" } }}
        startIcon={
          <Fab
            size="small"
            sx={{
              color: "white",
              backgroundImage: `linear-gradient(to bottom,#86AEAF,#457373,#86AEAF)`,
              ":hover": { background: "#7FA6A6" },
            }}
            aria-label="add"
          >
            <AddIcon />
          </Fab>
        }
        onClick={handleClick}
      >
        Add quote
      </ColorButton>
    </GridToolbarContainer>
  );
}
const ColorButton = styled(Button)(({}) => ({
  color: "#457373",
  fontWeight: "bold",
}));
export default function Quotes() {
  const [state, dispatch] = useComplaintContext();

  const quotesOfComplaint = state.complaints.find(
    (x) => x._id === state.selectedComplaint.id
  ).quotes;
  const suggestedQuotes = [];
  for (let i = 0; i < quotesOfComplaint.length; i++) {
    const quote = {};
    (quote.id = randomId()),
      (quote.name = quotesOfComplaint[i].businessName),
      (quote.address = quotesOfComplaint[i].address),
      (quote.quote = quotesOfComplaint[i].quote),
      suggestedQuotes.push(quote);
  }
  const [quotes, setQuotes] = useState(suggestedQuotes);
  useEffect(() => {
    dispatch({
      type: UPDATE_QUOTES,
      quotes: quotes,
    });
  }, [quotes]);
  const [rows, setRows] = useState(suggestedQuotes);
  const [rowModesModel, setRowModesModel] = useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  // when a quote is deleted from grid
  const handleDeleteClick = (id) => () => {
    let currentQuotes = state.quotes;
    setRows(rows.filter((row) => row.id !== id));
    const isAlreadyExisting = (quote) => quote.id === id;
    const index = currentQuotes.findIndex(isAlreadyExisting);

    if (index >= 0) {
      currentQuotes.splice(index, 1);
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    let currentQuotes = state.quotes;
    const quote = {};
    (quote.id = updatedRow.id),
      (quote.name = updatedRow.name),
      (quote.address = updatedRow.address),
      (quote.quote = updatedRow.quote);
    const isAlreadyExisting = (quote) => quote.id === updatedRow.id;
    const index = currentQuotes.findIndex(isAlreadyExisting);
    if (index >= 0) {
      currentQuotes.splice(index, 1);
    }
    currentQuotes.push(quote);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "name",
      headerName: "Business Name",
      renderHeader: () => <strong>{"Business Name "}</strong>,
      headerClassName: "super-app-theme--header",
      width: 300,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "address",
      headerName: "Address",
      renderHeader: () => <strong>{" Address "}</strong>,
      headerClassName: "super-app-theme--header",
      width: 310,
      editable: true,
      valueOptions: ["Market", "Finance", "Development"],
    },
    {
      field: "quote",
      headerName: "Quote",
      renderHeader: () => <strong>{"Quote "}</strong>,
      headerClassName: "super-app-theme--header",
      type: "number",
      width: 200,
      align: "left",
      headerAlign: "left",
      editable: true,
    },

    {
      field: "actions",
      type: "actions",
      renderHeader: () => <strong>{"actions "}</strong>,
      headerClassName: "super-app-theme--header",
      headerName: "Actions",
      width: 250,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
        "& .super-app-theme--header": {
          backgroundColor: "#101F33",
          color: "white",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}
