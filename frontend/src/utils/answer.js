export function getAnswers(questionId, access) {
    const headers = new Headers();
    access && headers.append("Authorization", `Bearer ${access}`);

    return fetch(`/api/comments/question/${questionId}`, {
            headers: headers,
        })
        .then(async (response) => {
            const comments = await response.json();
            return comments.map((comment) => {
                return {
                    "id": comment["id"],
                    "username": comment["username"],
                    "text": comment["text"],
                    "rating": comment["rating"],
                    "my_rate": comment["my_rate"],
                };
            });
        });
}

export function answerTheQuestion(questionId, answer, access) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${access}`);

    const formData = new FormData();
    formData.append("text", answer);

    return fetch(`/api/comments/question/${questionId}`, {
        method: "POST",
        headers: headers,
        body: formData,
    });
}

export function changeAnswerRating(answerId, action, access) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${access}`);

    const formData = new FormData();
    formData.append("action", action);
    formData.append("answer_id", answerId);

    return fetch(`/api/answers/rating`, {
        method: "PUT",
        headers: headers,
        body: formData,
    });
}
