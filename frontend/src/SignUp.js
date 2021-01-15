import {useState, useRef, useCallback} from "react";
import {Redirect} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {signUp, signIn} from "./utils/credentials";

import "./css/SignForm.scss";
import {SIGN_IN} from "./redux/actionTypes";

export default function SignUp(props) {
    const [nameHint, setNameHint] = useState(null);
    const [emailHint, setEmailHint] = useState(null);
    const [notice, setNotice] = useState(null);
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
        <form className="sign-form">
            <input type="text" ref={nameEl} className="form-control" placeholder="Name" required="" />
            {nameHint && <span className="text-danger">{nameHint}</span>}
            <input type="email" ref={emailEl} className="form-control" placeholder="Email" required="" autoFocus="" />
            {emailHint && <span className="text-danger">{emailHint}</span>}
            <input type="password" ref={passwordEl} className="form-control" placeholder="Password" required="" />
            <div className="w-100 btn btn-lg btn-primary btn-block" tabIndex="0"
                onClick={() => {
                    const name = nameEl.current.value;
                    const email = emailEl.current.value;
                    const password = passwordEl.current.value;

                    signUp(name, password, email)
                        .then((response) => {
                            if (!response.ok)
                            {
                                throw response;
                            }

                            signIn(name, password)
                                .then(({access, refresh}) => loginDispatch(refresh), console.warn);
                        })
                        .catch((response) => response.json())
                        .then((response) => {
                            if (response) {
                                setNotice(null);
                                setNameHint((response["username"] || [null])[0]);
                                setEmailHint((response["email"] || [null][0]));
                            }
                        });
                }}
                >Sign up</div>
            {refreshToken && <Redirect to="/" />}
            {notice && <div className="alert alert-success">{notice}</div>}
        </form>
    );
}
