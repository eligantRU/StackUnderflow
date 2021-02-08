import {askQuestion} from "./api/questions";

import RichTextEditor from "./components/RichTextEditor";
import {Redirect} from "react-router";
import {useState, useRef} from "react";
import {useSelector} from "react-redux";

import useRefresh from "./hooks/useRefresh";

export default function AskQuestion(props) {
    const titleEl = useRef(null);
    const [titleHint, setTitleHint] = useState(null);

    const [description, setDescription] = useState(null);
    const [answerId, setAnswerId] = useState(null);

    const withRefresh = useRefresh();

    const refreshToken = useSelector((state) =>  state.credentialsReducer.refresh);
    if (!refreshToken) {
        return <div className="alert alert-warning">Only signed in users can ask their questions.</div>;
    }

    return (
        <>
            <input type="text" className="w-50 form-control" placeholder="Title" ref={titleEl} required="" />
            {titleHint && <span className="text-danger">{titleHint}</span>}
            <RichTextEditor onUpdate={setDescription} />
            <div className="btn btn-lg btn-primary btn-block"
                onClick={() => {
                    withRefresh()
                        .then((access) => askQuestion(titleEl.current.value, description, access), console.warn)
                        .then(
                            (response) => setAnswerId(response["id"]),
                            (response) => {
                                setTitleHint((response["title"] || [null])[0]);
                            }
                        ).catch(console.warn);
                }}
                >Ask the question</div>
            {answerId && <Redirect to={`/question/${answerId}`} />}
        </>
    );
}
