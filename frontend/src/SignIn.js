import {useCallback, useState, useRef} from "react";
import {Redirect} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {SIGN_IN} from "./redux/actionTypes";
import {signIn} from "./utils/credentials";

import "./css/SignForm.scss";

export default function SignIn(props) {
    const dispatch = useDispatch();
    const loginDispatch = useCallback(
        (access, refresh) => dispatch({
            type: SIGN_IN,
            access: access,
            refresh: refresh,
        }),
        [dispatch],
    );
    const refreshToken = useSelector((state) =>  state.credentialsReducer.refresh);

    const [warning, setWarning] = useState(null);

    const [nameEl, passwordEl] = [useRef(null), useRef(null)];
    return (
        <form className="sign-form">
            <input type="text" ref={nameEl} className="form-control" placeholder="Name" required="" autoFocus="" />
            <input type="password" ref={passwordEl} className="form-control" placeholder="Password" required="" />
            <div className="w-100 btn btn-lg btn-primary btn-block" tabIndex="0"
                onClick={() => {
                    const username = nameEl.current.value;
                    const password = passwordEl.current.value;

                    signIn(username, password)
                        .then(({access, refresh}) => loginDispatch(refresh))
                        .catch((ex) => setWarning("Invalid login/password"));
                   }}
                >Sign in</div>
            {refreshToken && <Redirect to="/" />}
            {warning && <div className="alert alert-danger">{warning}</div>}
        </form>
    );
}
