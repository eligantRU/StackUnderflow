export function getQuestionsCount() {
    return fetch(`/api/questions/page/`)
        .then(async (response) => {
            const json = await response.json();
            return json["count"];
        });
}

export function getQuestions(page) {
    return fetch(`/api/questions/page/${page}`)
        .then((response) => response.json());
}

export function getQuestion(id) {
    return fetch(`/api/questions/${id}/`)
        .then((response) => response.json());
}

export function askQuestion(title, description, access) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${access}`);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    return fetch("/api/questions/", {
        method: "POST",
        headers: headers,
        body: formData,
    }).then(async (response) => {
        if (!response.ok) {
            throw await response.json();
        }
        return response.json();
    }, async (response) => {
        throw await response.json();
    });
}

export function markQuestionAsResolved(questionId, answerId, access) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${access}`);

    const formData = new FormData();
    formData.append("resolved_answer_id", answerId);

    return fetch(`/api/questions/${questionId}/`, {
            method: "PUT",
            headers: headers,
            body: formData,
        })
        .then(async (response) => {
            if (response.status !== 200) {
                throw await response.json();
            }
        });
}
