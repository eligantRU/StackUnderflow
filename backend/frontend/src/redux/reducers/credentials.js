import {SIGN_IN, SIGN_OUT} from "../actionTypes";

const STORAGE_KEYS = {
  REFRESH_TOKEN: "refresh",
  ID: "id",
};

const initialState = {
  refresh: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  id: parseInt(localStorage.getItem(STORAGE_KEYS.ID), 10),
};

export default function credentialsReducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_OUT: {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ID);
      return {
        ...state,
        refresh: null,
        id: null,
      };
    }
    case SIGN_IN: {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, action.refresh);
      localStorage.setItem(STORAGE_KEYS.ID, action.id);
      return {
        ...state,
        refresh: action.refresh,
        id: action.id,
      };
    }
    default:
      return state;
  }
}
