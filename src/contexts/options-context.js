import { createContext, useReducer } from 'react';

export const OPTIONS_SET_INTERPOLATE = 'options/SET_INTERPOLATE';
export const OPTIONS_SET_SHOW_BORDER = 'options/SET_SHOW_BORDER';
export const OPTIONS_SET_MASK_OPACITY = 'options/SET_MASK_OPACITY';
export const OPTIONS_SET_THRESHOLD = 'options/SET_THRESHOLD';

const initialState = {
  interpolate: true,
  showBorder: true,
  maskOpacity: 0.8,
  threshold: 0.5
};

const reducer = (state, action) => {
  switch (action.type) {
    case OPTIONS_SET_INTERPOLATE:
      return {
        ...state,
        interpolate: action.interpolate
      };

    case OPTIONS_SET_SHOW_BORDER:
      return {
        ...state,
        showBorder: action.showBorder
      };

    case OPTIONS_SET_MASK_OPACITY:
      return {
        ...state,
        maskOpacity: action.maskOpacity
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
