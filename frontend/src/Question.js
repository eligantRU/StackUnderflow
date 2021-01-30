import {useParams} from "react-router-dom";
import {Redirect} from "react-router";
import RichTextEditor from "./RichTextEditor";

import {getQuestion, markQuestionAsResolved} from "./utils/question";
import {getAnswers, answerTheQuestion} from "./utils/answer";
import {useMemo, useState} from "react";
import useRefresh from "./hooks/useRefresh";
import {useSelector} from "react-redux";

export default function Question(props) {
    const {questionId} = useParams();
    const [question, setQuestion] = useState(null);
    const [comments, setComments] = useState([]);
    const [answer, setAnswer] = useState(null);
    const [answersPassed, setAnswersPassed] = useState(0);
    const [questionPassed, setQuestionPassed] = useState(0);
    useMemo(() => getQuestion(questionId).then((question) => setQuestion(question)).catch(console.warn), [questionId, questionPassed]);
    useMemo(() => getAnswers(questionId).then(setComments).catch(console.warn), [questionId, answersPassed]);

    const {
        refresh: refreshToken,
        id: userId
    } = useSelector((state) =>  state.credentialsReducer);
    const withRefresh = useRefresh();

    if (question === undefined)
    {
        return <Redirect to="/" />;
    }
    if (question)
    {
        const isAnswered = Number.isInteger(question.resolved_answer_id);
        const isCurrUserQuestion = (question.owner_id === userId);

        const answersBlock = (
            <ul>
                {
                    comments && comments.map((comment, index) =>
                        <li className="bg-light" style={{
                                listStyleType: "none",
                            }} key={index}>
                            {!isAnswered && isCurrUserQuestion && (<button
                                onClick={() => {
                                    withRefresh()
                                        .then((access) => markQuestionAsResolved(questionId, comment.id, access))
                                        .then(() => setQuestionPassed((value) => value + 1))
                                        .catch(console.warn);
                                }}
                                >Mark as an answer</button>)}
                            {(question.resolved_answer_id === comment.id) && <span className="text-success">This is an answer!</span>}
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
        );
        const answerTheQuestionBlock = (() => {
            if (refreshToken) {
                if (isAnswered) {
                    return <div className="alert alert-info">This question is already answered.</div>;
                }
                return (
                    <div>
                        <RichTextEditor onUpdate={setAnswer} key={answersPassed} />
                        <div className="btn btn-lg btn-primary btn-block"
                            onClick={() => {
                                withRefresh()
                                    .then((access) => answerTheQuestion(questionId, answer, access))
                                    .then(() => setAnswersPassed((value) => value + 1))
                                    .catch(console.warn);
                            }}
                        >Answer it!</div>
                    </div>
                );
            } else {
                return <div className="alert alert-warning">Only authorized users can answer the question.</div>;
            }
        })();

        return (
            <>
                <h1>{question.title}</h1>
                <h6>{question.owner_id__username} asks</h6>
                <div
                    dangerouslySetInnerHTML={{
                        __html: question.description
                    }}
                    />
                {answersBlock}
                {answerTheQuestionBlock}
            </>
        );
    }
    return <></>;
}
