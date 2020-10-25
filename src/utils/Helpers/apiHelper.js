export function makeApiCall(props) {
    const params = {
        method: props.method || "GET",
        headers: {
            "Content-Type": "application/json",
            ...(props.headers ?? {}),
        },
    };

    if (typeof AbortController !== "undefined") {
        const controller = new AbortController();
        const signal = controller.signal;
        setTimeout(() => controller.abort(), props.timeout || 10000);
        params.signal = signal;
    }

    if (
        ["post", "delete", "put"].indexOf(
            params.method.toLowerCase() ?? ""
        ) !== -1
    ) {
        params.body = JSON.stringify(props.bodyParams || {});
    }

    return fetch(props.url, params).then((res) => res.json());
}
