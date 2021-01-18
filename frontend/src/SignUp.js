import {useState, useRef, useCallback} from "react";
import {Redirect} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {signUp, signIn} from "./utils/credentials";

import "./css/Form.scss";
import {SIGN_IN} from "./redux/actionTypes";

export default function SignUp(props) {
    const [nameHint, setNameHint] = useState(null);
    const [emailHint, setEmailHint] = useState(null);
    const [passwordHint, setPasswordHint] = useState(null);

    const refreshToken = useSelector((state) =>  state.credentialsReducer.refresh);

    const dispatch = useDispatch();
    const loginDispatch = useCallback(
        (refresh) => dispatch({
            type: SIGN_IN,
            refresh: refresh,
        }),
        [dispatch],
    );

    const [nameEl, emailEl, passwordEl] = [useRef(null), useRef(null), useRef(null)];
    return (
        <form className="form">
            <input type="text" ref={nameEl} className="form-control" placeholder="Name" required="" />
            {nameHint && <span className="text-danger">{nameHint}</span>}
            <input type="email" ref={emailEl} className="form-control" placeholder="Email" required="" autoFocus="" />
            {emailHint && <span className="text-danger">{emailHint}</span>}
            <input type="password" ref={passwordEl} className="form-control" placeholder="Password" required="" />
            {passwordHint && <span className="text-danger">{passwordHint}</span>}
            <div className="w-100 btn btn-lg btn-primary btn-block" tabIndex="0"
                onClick={() => {
                    const name = nameEl.current.value;
                    const email = emailEl.current.value;
                    const password = passwordEl.current.value;

                    signUp(name, password, email)
                        .then(
                            () => signIn(name, password).then(loginDispatch, console.warn),
                            (response) => {
                                setNameHint((response["username"] || [null])[0]);
                                setEmailHint((response["email"] || [null][0]));
                                setPasswordHint((response["password"] || [null][0]));
                            }
                        ).catch(console.warn);
                }}
                >Sign up</div>
            {refreshToken && <Redirect to="/" />}
        </form>
    );
}
