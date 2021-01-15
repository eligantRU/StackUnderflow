import Navbar from "react-bootstrap/Navbar"; // TODO: extra dependency
import {Link} from "react-router-dom";
import {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SIGN_OUT} from "./redux/actionTypes";

export default function Header(props) { // TODO: https://getbootstrap.com header styling ?
    const dispatch = useDispatch();
    const logoutDispatch = useCallback(
        () => dispatch({
            type: SIGN_OUT,
        }),
        [dispatch],
    );
    const refreshToken = useSelector((state) =>  state.credentialsReducer.refresh);
    return (
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className="fixed-top">
            <Link className="navbar-brand" to="/">StackUnderflow</Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <div className="navbar-nav ms-lg-auto">
                    <div className="justify-content-center mt-0">
                        <input className="header-search form-control" type="text" placeholder="Search" aria-label="Search" />
                    </div>
                </div>
                <Link className="btn btn-primary" to="/ask_question">Ask a question</Link>
                <div className="navbar-nav ms-lg-auto">
                    {!refreshToken && <Link className="nav-link" to="/sign_in">Sign in</Link>}
                    {!refreshToken && <Link className="nav-link" to="/sign_up">Sign up</Link>}
                    {refreshToken && <Link className="nav-link" to="/" onClick={logoutDispatch}>Sign out</Link>}
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
}
