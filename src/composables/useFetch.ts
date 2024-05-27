interface Option {
	method?: string
	body?: string
}

<<<<<<< HEAD
const baseUrl = import.meta.env.VITE_JIBBER_BASE_URL

const useFetch =  async (uri: string, option?: Option) => {
=======
const useFetch = (url: string, option?: Option) => {
>>>>>>> 5c74f1e (added a fetch composable)

	try {
		const defaultOption = {
				mode: "cors",
				headers: {
					"Accept": "application/json",
					"Content-type": "application/json"
				},
				method: "GET",
				credentials: "include"
			}

		const response = option ? await fetch(`${baseUrl}${uri}`, { ...defaultOption, ...option })
														: await fetch(`${baseUrl}${uri}`, defaultOption)
		return response
	} catch(e) {
		if(e instanceof Error) {
			throw new Error(e)
		}
	}
}

export { useFetch }