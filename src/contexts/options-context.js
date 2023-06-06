import { createContext, useReducer } from 'react';

export const OPTIONS_SET_THRESHOLD = 'options/SET_THRESHOLD';

const initialState = {
  threshold: 0
};

const reducer = (state, action) => {
  switch (action.type) {
    case OPTIONS_SET_THRESHOLD:
      return {
        ...state,
        threshold: action.threshold
      };

    default: 
      throw new Error('Invalid options context action: ' + action.type);
  }
}

export const OptionsContext = createContext(initialState);

export const OptionsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
 
  return (
    <OptionsContext.Provider value={ [state, dispatch] }>
      { children }
    </OptionsContext.Provider>
  )
} 
