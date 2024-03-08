import {
  UPDATE_COMPLAINTS,
  CURRENT_SELECTED_ITEM,
  UPDATE_ROLE,
  UPDATE_PROPERTIES,
  SELECTED_COMPLAINT,
  CLEAR_CURRENT_SELECTED_ITEM,
  UPDATE_QUOTES,
  UPDATE_COMPLAINT,
  CLEAR_UPDATE_COMPLAINT,
  CLEAR_QUOTES,
  UPDATE_USERS,
  UPDATE_PROPERTY,
  CLEAR_UPDATE_PROPERTY,
} from "./actions";
// The reducer is a function that accepts the current state and an action. It returns a new state based on that action.
export const reducer = (state, action) => {
  switch (action.type) {
    // Returns a copy of state with an updated complaints array. We use the action.complaints property and spread it's contents into the new array.
    case UPDATE_COMPLAINTS:
      return {
        ...state,
        complaints: [...action.complaints],
      };

    case SELECTED_COMPLAINT:
      return {
        ...state,
        selectedComplaint: action.selectedComplaint,
      };
    case UPDATE_PROPERTIES:
      return {
        ...state,
        properties: [...action.properties],
      };
    case CURRENT_SELECTED_ITEM:
      return {
        ...state,
        selectedItem: action.selectedItem,
      };

    case UPDATE_ROLE:
      return {
        ...state,
        role: action.role,
      };
    case UPDATE_QUOTES:
      return {
        ...state,
        quotes: [...action.quotes],
      };
    case UPDATE_USERS:
      return {
        ...state,
        users: [...action.users],
      };

    //sets the state as true for update complaint
    case UPDATE_COMPLAINT:
      return {
        ...state,
        updateComplaint: true,
      };
    //sets the state as true for update property
    case UPDATE_PROPERTY:
      return {
        ...state,
        updateProperty: true,
      };
    //clears the state
    case CLEAR_UPDATE_COMPLAINT:
      return {
        ...state,
        updateComplaint: false,
      };
    //clears the current selected item
    case CLEAR_CURRENT_SELECTED_ITEM:
      return {
        ...state,
        selectedItem: "",
      };
    //clears the update property state and set it as false
    case CLEAR_UPDATE_PROPERTY:
      return {
        ...state,
        updateProperty: false,
      };

    case CLEAR_QUOTES:
      return {
        ...state,
        quotes: [],
      };
    default:
      return state;
  }
};
