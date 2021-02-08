import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "./redux/reducers";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Footer from "./components/Footer"
import Header from "./components/Header"

import Questions from "./Questions";
import AskQuestion from "./AskQuestion";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Question from "./Question";
import Account from "./Account";

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Content.scss";
import "./css/index.css";

const STORE = createStore(rootReducer);

function Content(props) {
    return (
        <main className="container">
            <Switch>
                <Route path="/sign_in">
                    <SignIn />
                </Route>
                <Route path="/sign_up">
                    <SignUp />
                </Route>
                <Route path="/ask_question">
                    <AskQuestion />
                </Route>
                <Route path="/question/:questionId">
                    <Question />
                </Route>
                <Route path="/questions/:page">
                    <Questions />
                </Route>
                <Route path="/account">
                    <Account />
                </Route>
                <Route path="/">
                    <Questions />
                </Route>
            </Switch>
        </main>
    );
}

function App() {
    return (
        <Router>
            <div>
                <Header />
                <Content />
                <Footer />
            </div>
        </Router>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <Provider store={STORE}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)
