import { createSlice } from "@reduxjs/toolkit";
import { TOKEN_NAME, doApiGet, doApiLogin } from "../services/apiService";


const userDetails = async () => {
  try {
    let data = await doApiGet("/users/myInfo")
    if (data.msg) {
      localStorage.removeItem(TOKEN_NAME)
      window.location.href = "/"
      return null
    }
    return data
  }
  catch (err) {

  }

}


const userSlice = createSlice({
  name: "users",
  initialState: {
    isLoggedIn: localStorage[TOKEN_NAME] ? true : false,
    dataUser: localStorage[TOKEN_NAME] ? await userDetails() : null,
  },
  reducers: {
    logout: (state, action) => {
      state.isLoggedIn = false
      localStorage.removeItem(TOKEN_NAME)
      window.location.href = "/"

    },
    login: (state, action) => {
      state.isLoggedIn = true
    }
  }
})



export const { login, logout } = userSlice.actions;
export default userSlice.reducer;