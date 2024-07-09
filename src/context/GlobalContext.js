import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  contacts: [],
  leads: {
    new: [],
    contacted: [],
    qualified: [],
    closed: []
  },
  tasks: [],
  emails: [],
  user: null,
  notifications: []
};

// Action types
const ADD_CONTACT = 'ADD_CONTACT';
const UPDATE_CONTACT = 'UPDATE_CONTACT';
const DELETE_CONTACT = 'DELETE_CONTACT';
const ADD_LEAD = 'ADD_LEAD';
const UPDATE_LEAD = 'UPDATE_LEAD';
const MOVE_LEAD = 'MOVE_LEAD';
const ADD_TASK = 'ADD_TASK';
const UPDATE_TASK = 'UPDATE_TASK';
const DELETE_TASK = 'DELETE_TASK';
const SEND_EMAIL = 'SEND_EMAIL';
const SET_USER = 'SET_USER';
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
const RESET_DATA = 'RESET_DATA';
const RESET_DATA_ERROR = 'RESET_DATA_ERROR';

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case ADD_CONTACT:
      return { ...state, contacts: [...state.contacts, action.payload] };
    case UPDATE_CONTACT:
      return { ...state, contacts: state.contacts.map(contact => contact.id === action.payload.id ? action.payload : contact) };
    case DELETE_CONTACT:
      return { ...state, contacts: state.contacts.filter(contact => contact.id !== action.payload) };
    case ADD_LEAD:
      return { ...state, leads: { ...state.leads, [action.payload.status]: [...state.leads[action.payload.status], action.payload] } };
    case UPDATE_LEAD:
      return {
        ...state,
        leads: {
          ...state.leads,
          [action.payload.status]: state.leads[action.payload.status].map(lead => 
            lead.id === action.payload.id ? action.payload : lead
          )
        }
      };
    case MOVE_LEAD:
      const { leadId, fromStatus, toStatus } = action.payload;
      const leadToMove = state.leads[fromStatus].find(lead => lead.id === leadId);
      return {
        ...state,
        leads: {
          ...state.leads,
          [fromStatus]: state.leads[fromStatus].filter(lead => lead.id !== leadId),
          [toStatus]: [...state.leads[toStatus], { ...leadToMove, status: toStatus }]
        }
      };
    case ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case UPDATE_TASK:
      return { ...state, tasks: state.tasks.map(task => task.id === action.payload.id ? action.payload : task) };
    case DELETE_TASK:
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case SEND_EMAIL:
      return { ...state, emails: [...state.emails, action.payload] };
    case SET_USER:
      return { ...state, user: action.payload };
    case ADD_NOTIFICATION:
      return { ...state, notifications: [...state.notifications, action.payload] };
    case REMOVE_NOTIFICATION:
      return { ...state, notifications: state.notifications.filter(notif => notif.id !== action.payload) };
    case RESET_DATA:
      return { ...state, ...action.payload };
    case RESET_DATA_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Create context
const GlobalContext = createContext();

// Context provider
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load state from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem('crmState');
    if (savedState) {
      dispatch({ type: 'RESET_DATA', payload: JSON.parse(savedState) });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('crmState', JSON.stringify(state));
  }, [state]);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobalContext = () => useContext(GlobalContext);

// Action creators
export const addContact = (contact) => ({ type: ADD_CONTACT, payload: contact });
export const updateContact = (contact) => ({ type: UPDATE_CONTACT, payload: contact });
export const deleteContact = (contactId) => ({ type: DELETE_CONTACT, payload: contactId });
export const addLead = (lead) => ({ type: ADD_LEAD, payload: lead });
export const updateLead = (lead) => ({ type: UPDATE_LEAD, payload: lead });
export const moveLead = (leadId, fromStatus, toStatus) => ({ type: MOVE_LEAD, payload: { leadId, fromStatus, toStatus } });
export const addTask = (task) => ({ type: ADD_TASK, payload: task });
export const updateTask = (task) => ({ type: UPDATE_TASK, payload: task });
export const deleteTask = (taskId) => ({ type: DELETE_TASK, payload: taskId });
export const sendEmail = (email) => ({ type: SEND_EMAIL, payload: email });
export const setUser = (user) => ({ type: SET_USER, payload: user });
export const addNotification = (notification) => ({ type: ADD_NOTIFICATION, payload: notification });
export const removeNotification = (notificationId) => ({ type: REMOVE_NOTIFICATION, payload: notificationId });
export const resetData = (data) => ({ type: RESET_DATA, payload: data });
export const resetDataError = (error) => ({ type: RESET_DATA_ERROR, payload: error });