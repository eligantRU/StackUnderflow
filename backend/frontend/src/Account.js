import useRefresh from "./hooks/useRefresh";
import {useSelector} from "react-redux";
import {Redirect} from "react-router";
import {useMemo, useRef, useState} from "react";
import {getCurrentUserInfo, updateCurrentUserInfo} from "./api/credentials";

import "./css/Form.scss";

export default function Account(props) {
    const [emailEl, oldPasswordEl, newPasswordEl] = [useRef(null), useRef(null), useRef(null)];

    const [emailHint, setEmailHint] = useState(null);
    const [oldPasswordHint, setOldPasswordHint] = useState(null);
    const [newPasswordHint, setNewPasswordHint] = useState(null);

    const withRefresh = useRefresh();
    useMemo(() => withRefresh().then(getCurrentUserInfo).then((userInfo) => {
        emailEl.current.value = userInfo["email"];
    }).catch(console.warn), [withRefresh, emailEl]);

    const refreshToken = useSelector((state) =>  state.credentialsReducer.refresh);
    if (!refreshToken) {
        return <>{refreshToken && <Redirect to="/" />}</>;
    }
    return (
        <div className="form">
            <h1>Account settings</h1>
            <div className="row">
                <div className="col text-end">Email</div>
                <input type="email" className="col form-control" ref={emailEl} required="" />
                {emailHint && <span className="text-danger">{emailHint}</span>}
            </div>
            <div className="row">
                <div className="col text-end">Password (old)</div>
                <input type="password" className="col form-control" ref={oldPasswordEl} required=""/>
                {oldPasswordHint && <span className="text-danger">{oldPasswordHint}</span>}
            </div>
            <div className="row">
                <div className="col text-end">Password (new)</div>
                <input type="password" className="col form-control" ref={newPasswordEl} required=""/>
                {newPasswordHint && <span className="text-danger">{newPasswordHint}</span>}
            </div>
            <div className="w-100 btn btn-lg btn-primary btn-block" tabIndex="0"
                onClick={() => {
                    const email = emailEl.current.value;
                    const oldPassword = oldPasswordEl.current.value;
                    const newPassword = newPasswordEl.current.value;

                    withRefresh()
                        .then((access) => updateCurrentUserInfo(access, {
                            email: email || undefined,
                            oldPassword: oldPassword || undefined,
                            newPassword: newPassword || undefined,
                        }))
                        .then(
                            () => window.location.reload(), // TODO: looks ugly
                            (response) => {
                                setEmailHint((response["email"] || [null])[0]);
                                setOldPasswordHint((response["old_password"] || [null])[0]);
                                setNewPasswordHint((response["password"] || [null])[0]);
                            }
                        ).catch(console.warn);
                   }}
                >Update</div>
        </div>
    );
}
