const petsReducer = (state = [], action) => {
   if (action.type === 'SET_PETS') {
      return action.payload;
   }
   return state
};

export default petsReducer;