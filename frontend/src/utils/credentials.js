export function signIn(username, password) {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    return fetch("/api/token/", {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (!response.ok)
            {
                throw new Error();
            }
            return response;
        })
        .then((response) => response.json())
        .then((response) => {
            const [access, refresh] = [response["access"], response["refresh"]];
            if (!access || !refresh)
            {
                throw new Error();
            }
            return {
                access: access,
                refresh: refresh,
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
    });
}

export function refresh(refresh, logOut) {
    const formData = new FormData();
    formData.append("refresh", refresh);

    return fetch("/api/token/refresh/", {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error("Refresh-token has been expired");
            }
            return response;
        })
        .then((response) => response.json())
        .then((response) => response["access"])
        .catch((ex) => {
            logOut();
            throw ex;
        });
}
