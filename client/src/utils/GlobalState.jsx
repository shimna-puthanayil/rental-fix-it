import { createContext, useContext, useReducer } from "react";
// Import reducer
import { reducer } from "./reducers.js";
// Initialize new context
const ComplaintContext = createContext();
const { Provider } = ComplaintContext;

const ComplaintProvider = ({ value = [], ...props }) => {
  // Initialize `useReducer` hook. Returns state and a dispatch function. Accepts arguments of our reducer and initial state
  const [state, dispatch] = useReducer(reducer, {
    selectedItem: "",
    complaints: [],
    role: "",
    properties: [],
    selectedComplaint: "",
    quotes: [],
    updateComplaint: false,
    users: [],
    updateProperty: false,
  });
  // The value prop expects an initial state object and it has given the global state object and the dispatch function from `useReducer` hook
  return <Provider value={[state, dispatch]} {...props} />;
};
// Custom hook to provide usage of the Complaint context
const useComplaintContext = () => {
  return useContext(ComplaintContext);
};

export { ComplaintProvider, useComplaintContext };
