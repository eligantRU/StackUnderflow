import {useParams} from "react-router-dom";
import {Redirect} from "react-router";
import RichTextEditor from "./RichTextEditor";

import {getQuestion} from "./utils/question";
import {getAnswers, answerTheQuestion} from "./utils/comment";
import {useMemo, useState} from "react";
import useRefresh from "./hooks/useRefresh";
import {useSelector} from "react-redux";

export default function Question(props) {
    const {questionId} = useParams();
    const [question, setQuestion] = useState(null);
    const [comments, setComments] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [answersPassed, setAnswersPassed] = useState(0);
    useMemo(() => getQuestion(questionId).then((question) => setQuestion(question)).catch(console.warn), [questionId]);
    useMemo(() => getAnswers(questionId).then(setComments).catch(console.warn), [questionId, answersPassed]);

    const refreshToken = useSelector((state) =>  state.credentialsReducer.refresh);
    const withRefresh = useRefresh();

    if (question === undefined)
    {
        return <Redirect to="/" />;
    }
    if (question)
    {
        return (
            <>
                <h1>{question.title}</h1>
                <h6>{question.owner_id__username} asks</h6>
                <div
                    dangerouslySetInnerHTML={{
                        __html: question.description
                    }}
                    />
                <ul>
                    {
                        comments && comments.map((comment, index) =>
                            <li className="bg-light" style={{
                                    listStyleType: "none",
                                }} key={index}>
                                <div className="fw-bold">{comment["username"]}'s answer</div>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: comment["text"]
                                    }}
                                    />
                            </li>
                        )
                    }
                </ul>
                {!refreshToken && <div className="alert alert-warning">Only authorized users can answer the question.</div>}
                {
                    refreshToken && (
                        <div>
                            <RichTextEditor onUpdate={setAnswer} key={answersPassed} />
                            <div className="btn btn-lg btn-primary btn-block"
                                onClick={() => {
                                    withRefresh()
                                        .then((access) => answerTheQuestion(questionId, answer, access))
                                        .then((response) => {
                                            if (!response.ok) {
                                                throw response;
                                            }
                                        })
                                        .then(() => {
                                            setAnswersPassed((value) => value + 1);

                                        })
                                        .catch((response) => {
                                            console.warn(response);
                                        });
                                }}
                            >Answer it!</div>
                        </div>)
                }
            </>
        );
    }
    return <></>;
}
