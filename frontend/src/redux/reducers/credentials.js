import {SIGN_IN, SIGN_OUT} from "../actionTypes";

const STORAGE_KEYS = {
  REFRESH_TOKEN: "refresh",
};

const initialState = {
  refresh: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
};

export default function credentialsReducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_OUT: {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      return {
        ...state,
        refresh: null,
      };
    }
    case SIGN_IN: {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, action.refresh);
      return {
        ...state,
        refresh: action.refresh,
      };
    }
    default:
      return state;
  }
}
