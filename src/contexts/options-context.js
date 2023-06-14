import { createContext, useReducer } from 'react';

export const OPTIONS_SET_INTERPOLATE = 'options/SET_INTERPOLATE';
export const OPTIONS_SET_VISUALIZATION_TYPE = 'options/SET_VISUALIZATION_TYPE';
export const OPTIONS_SET_VISUALIZATION_OPACITY = 'options/SET_VISUALIZATION_OPACITY';
export const OPTIONS_SET_THRESHOLD = 'options/SET_THRESHOLD';

const initialState = {
  interpolate: true,
  visualizationType: 'borders',
  visualizationOpacity: 0.8,
  threshold: 0.5
};

const reducer = (state, action) => {
  switch (action.type) {
    case OPTIONS_SET_INTERPOLATE:
      return {
        ...state,
        interpolate: action.interpolate
      };

    case OPTIONS_SET_VISUALIZATION_TYPE:
      return {
        ...state,
        visualizationType: action.visualizationType
      };

    case OPTIONS_SET_VISUALIZATION_OPACITY:
      return {
        ...state,
        visualizationOpacity: action.visualizationOpacity
      };

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
