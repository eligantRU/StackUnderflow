import {Link} from "react-router-dom";

import "../css/Pagination.scss";

function getQuestionPageUrl(page) {
    return `/questions/${page}`;
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function PaginationChevron(props) {
    const target = props.center + props.offset;
    if (((props.offset < 0) && (props.center <= 3))
        || ((props.offset > 0) && (props.center > props.count - 3))) {
        return <></>;
    }

    return (
        <li className="page-item">
            <Link className="page-link" to={getQuestionPageUrl(clamp(target, 1, props.count))}>
                <span aria-hidden="true">{props.value}</span>
            </Link>
        </li>
    );
}

function PaginationLink(props) {
    const target = props.target;
    if (!((1 <= target) && (target <= props.count))) {
        return <></>;
    }

    return (
        <li className="page-item">
            <Link className={"page-link" + ((target === props.current) ? " fw-bold" : "")} to={getQuestionPageUrl(target)}>{target}</Link>
        </li>
    );
}

export default function Pagination(props) {
    const countPages = parseInt(props.count, 10);
    const currentPage = parseInt(props.current, 10);
    const capacity = parseInt(props.capacity, 10);
    const subCenter = Math.ceil(capacity / 2);
    const left = Math.min(countPages - capacity, Math.max(0, currentPage - subCenter));
    const center = left + subCenter;

    return (
        <ul className="pagination">
            <PaginationChevron value="«" offset={-capacity} center={center} count={countPages}  />
            {
                [...Array(countPages).keys()]
                    .slice(left, left + capacity)
                    .map((num) => <PaginationLink key={num} target={num + 1} current={currentPage} count={countPages} />)
            }
            <PaginationChevron value="»" offset={+capacity} center={center} count={countPages} />
        </ul>
    );
}
