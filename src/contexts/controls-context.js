import { createContext, useReducer } from 'react';

export const CONTROLS_SET_SHOW_DOCUMENTATION = 'Controls/SET_SHOW_DOCUMENTATION';

const initialState = {
  show: true
};

const reducer = (state, action) => {
  switch (action.type) {
    case CONTROLS_SET_SHOW_DOCUMENTATION:
      return {
        ...state,
        show: action.show
      };

    default: 
      throw new Error('Invalid controls context action: ' + action.type);
  }
}

export const ControlsContext = createContext(initialState);

export const ControlsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
 
  return (
    <ControlsContext.Provider value={ [state, dispatch] }>
      { children }
    </ControlsContext.Provider>
  )
} 
