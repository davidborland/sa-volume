import { createContext, useReducer } from 'react';

export const DATA_SET_IMAGES = 'data/SET_IMAGES';
export const DATA_SET_MASKS = 'data/SET_MASKS';

const initialState = {
  imageName: '',
  images: [],
  embeddings: [],
  masks: []
};

const initializeMasks = images => {
  const mask = images.length > 0 ? Array(images[0].width * images[0].height).fill(0) : [];

  return images.map(_ => [...mask]);
};

const reducer = (state, action) => {
  switch (action.type) {
    case DATA_SET_IMAGES:
      return {
        ...state,
        imageName: action.imageName,
        images: action.images,
        embeddings: action.embeddings,
        masks: initializeMasks(action.images)
      };

    case DATA_SET_MASKS:
      return {
        ...state,
        masks: action.masks
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
