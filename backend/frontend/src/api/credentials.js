export function signIn(username, password) {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    return fetch("/api/token/", {
        method: "POST",
        body: formData,
    })
        .then(async (response) => {
            const json = await response.json();
            if (!response.ok) {
                throw await json;
            }
            return {
                access: json["access"],
                refresh: json["refresh"],
            };
        });
}

export function signUp(username, password, email) {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);

    return fetch("/api/users/", {
        method: "POST",
        body: formData,
    })
        .then(async (response) => {
            if (!response.ok) {
                throw await response.json();
            }
        }, async (response) => {
            throw await response.json()
        });
}

export function refresh(refresh, logOut) {
    const formData = new FormData();
    formData.append("refresh", refresh);

    return fetch("/api/token/refresh/", {
        method: "POST",
        body: formData,
    })
        .then(async (response) => {
            if (response.status === 401) {
                throw new Error("Refresh-token has been expired");
            }
            const json = await response.json();
            return json["access"];
        })
        .catch((ex) => {
            logOut();
            throw ex;
        });
}

export function getCurrentUserInfo(access) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${access}`);

    return fetch("/api/users/", {
            method: "GET",
            headers: headers,
        })
        .then((response) => response.json());
}

export function updateCurrentUserInfo(access, {email, oldPassword, newPassword}) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${access}`);

    const formData = new FormData();
    email && formData.append("email", email);
    oldPassword && formData.append("old_password", oldPassword);
    newPassword && formData.append("new_password", newPassword);

    return fetch("/api/users/", {
            method: "PUT",
            headers: headers,
            body: formData,
        })
        .then((response) => {
            if (!response.ok || (response.status === 400)) {
                throw response;
            }
            return response.json();
        }).catch(async (response) => {
            throw await response.json();
        });
}
