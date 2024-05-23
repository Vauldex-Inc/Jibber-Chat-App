interface Option {
	method?: string
	body?: string
}

const useFetch =  async (url: string, option?: Option) => {

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

		const response = option ? await fetch(url, { ...defaultOption, ...option })
														: await fetch(url, defaultOption)
		const data = await response.json()
		return data
	} catch(e) {
		if(e instanceof Error) {
			throw new Error(e)
		}
	}
}

export { useFetch }