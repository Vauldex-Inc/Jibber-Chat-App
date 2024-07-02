interface Option {
  method: "GET" | "PUT" | "DELETE" | "POST"
  body?: string;
}

const baseUrl = import.meta.env.VITE_JIBBER_BASE_URL

export const useFetch =  async (uri: string, option?: Option) => {

	const response = await fetch(baseUrl + uri, {
    method: option ? option.method : "GET",
    body:
      option && (option.method === "POST" || option?.method === "PUT")
        ? option.body
        : undefined,
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return response;
}