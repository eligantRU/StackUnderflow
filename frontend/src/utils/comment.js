export function getAnswers(questionId) {
    return fetch(`/api/comments/question/${questionId}`)
        .then((response) => response.json())
        .then((response) => response.map((comment) => {
            return {
                "username": comment["owner_id__username"],
                "text": comment["text"],
            };
        }));
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
