import {getQuestionsCount, getQuestions} from "./utils/question";
import {useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom";

import Pagination from "./Pagination";

export default function Questions(props) {
    const [pagesCount, setPagesCount] = useState(0);
    useEffect(() => void(getQuestionsCount().then(setPagesCount, console.warn)), []);

    const {page} = useParams();
    const [questions, setQuestions] = useState([]);
    useEffect(() => void(getQuestions(page || 1).then(setQuestions, console.warn)), [page]);

    return (
        <>
            <ul className="list-group">
                {
                    questions.map((item) =>
                        <Link to={`/question/${item.id}`} key={item.id}>
                            <li className="list-group-item">{item.title}</li>
                        </Link>)
                }
            </ul>
            <Pagination count={pagesCount} current={page || 1} capacity={5} />
        </>
    );
}
