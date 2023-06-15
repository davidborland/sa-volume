import { createContext, useReducer } from 'react';

export const ERROR_SET_MESSAGE = 'error/SET_MESSAGE';
export const ERROR_CLEAR_MESSAGE = 'error/CLEAR_MESSAGE'

export class LoadingError extends Error {
  constructor(heading, message) {
    super(message);
    this.heading = heading;
    Error.captureStackTrace(this, LoadingError);
  }
}

const initialState = {
  heading: null,
  message: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case ERROR_SET_MESSAGE:
      return {
        ...state,
        heading: action.heading,
        message: action.message
      };

    case ERROR_CLEAR_MESSAGE:
      return {
        ...initialState
      };

    default: 
      throw new Error('Invalid error context action: ' + action.type);
  }
}

export const ErrorContext = createContext(initialState);

export const ErrorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
 
  return (
    <ErrorContext.Provider value={ [state, dispatch] }>
      { children }
    </ErrorContext.Provider>
  )
} 
