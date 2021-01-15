import {Switch, Route} from "react-router-dom";

import Questions from "./Questions";
import AskQuestion from "./AskQuestion";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Question from "./Question";

import "./css/Content.scss";

export default function Content(props) {
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
                <Route path="/">
                    <Questions />
                </Route>
            </Switch>
        </main>
    );
}
