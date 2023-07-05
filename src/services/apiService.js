import axios from "axios";
import { useNavigate } from "react-router-dom";

export const API_URL = "https://stayease-server.onrender.com" //https://stayease.onrender.com
export const TOKEN_NAME = "USER_TOKEN"


export const doApiGet = async (_url) => {
  try {
    let url = API_URL + _url;
    let resp = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        "x-api-key": localStorage.getItem(TOKEN_NAME)

      }
    })
    let data = await resp.json();
    return data
  }
  catch (err) {
    throw err;
  }
}

// For Post,delete, put, patch
export const doApiMethod = async (_url, _method, _body = {}) => {
  try {
    console.log(_body);
    let resp = await axios({
      url: (API_URL + _url),
      method: _method,
      data: _body,
      headers: {
       "x-api-key": localStorage[TOKEN_NAME]
      }
    })
    return resp;
  }
  catch (err) {
    throw err;
  }
}





export const doApiLogin = async (_body) => {
    let url = API_URL + "/users/login";
    console.log(_body);

    await fetch(url, {
      method: "POST",
      body: JSON.stringify(_body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(resp => resp.json())
      .then(async (data) => {
        if (data.your_token) {
          localStorage.setItem(TOKEN_NAME, data.your_token)
        }
      })
}
