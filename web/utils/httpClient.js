const httpClient = () => {
  const baseURL = `${process.env.API_BASE_URL}`;

  return {
    get: (url, config) =>
      fetch(`${baseURL}${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...config?.headers,
        },
      }),
    post: (url, payload, config) =>
      fetch(`${baseURL}${url}`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          ...config?.headers,
          "Content-Type": "application/json",
        },
      }),
    put: (url, payload, config) =>
      fetch(`${baseURL}${url}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          ...config?.headers,
        },
      }),
  };
};

export default httpClient();
