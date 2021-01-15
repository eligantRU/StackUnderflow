import {useCallback} from "react";
import {useSelector, useDispatch} from "react-redux";
import {SIGN_OUT} from "../redux/actionTypes";
import {refresh} from "../utils/credentials";

export default function useRefresh() {
    const dispatch = useDispatch();
    const logoutDispatch = useCallback(
        () => dispatch({
            type: SIGN_OUT,
        }),
        [dispatch],
    );

    const refreshToken = useSelector((state) =>  state.credentialsReducer.refresh);
    return () => refresh(refreshToken, () => refreshToken && logoutDispatch());
}
