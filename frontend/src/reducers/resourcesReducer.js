const initialState = {
  foodAmount: 0,
  foodGeneration: 0,
  goldAmount: 0,
  goldGeneration: 0,
};

const resourcesReducer = (state = initialState, action) => {
  if (action.type === 'SET_RESOURCES') {
    return {
      ...state,
      foodAmount: action.resources.foodAmount,
      foodGeneration: action.resources.foodGeneration,
      goldAmount: action.resources.goldAmount,
      goldGeneration: action.resources.goldGeneration,
    };
  }
  return state;
};

export default resourcesReducer;
