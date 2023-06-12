import { createContext, useReducer } from 'react';

export const DATA_SET_IMAGES = 'data/SET_IMAGES';

const initialState = {
  imageName: '',
  images: [],
  embeddings: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case DATA_SET_IMAGES:
      return {
        ...state,
        imageName: action.imageName,
        images: action.images,
        embeddings: action.embeddings
      };

    default: 
      throw new Error('Invalid data context action: ' + action.type);
  }
}

export const DataContext = createContext(initialState);

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
 
  return (
    <DataContext.Provider value={ [state, dispatch] }>
      { children }
    </DataContext.Provider>
  )
} 
