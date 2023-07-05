import { createSlice } from "@reduxjs/toolkit";
import { TOKEN_NAME } from "../services/apiService";



const adSlice = createSlice({
  name: "ads",
  initialState: {
    adData:{}
  },
  reducers: {
    addParameter: (state, action) => {
        state.adData={ ...state.adData, ...action.payload.data };
        console.log(state.adData);
    },
    adEdit: (state, action) => {
        state.adData={...action.payload.data };
    },
    removeSlice: (state, action) => {
      state.adData={};
  },
  }
})



export const {addParameter, adEdit,removeSlice } = adSlice.actions;
export default adSlice.reducer;