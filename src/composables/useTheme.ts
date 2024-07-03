import { ref } from "vue"
import { z } from 'zod'

const ThemeValue = z.enum(["dark", "light"])

type Theme = z.infer<typeof ThemeValue>

const current = ref<Theme>("light")

export const useTheme = () => {
	const init = () => {
		const theme = localStorage.getItem("theme") as Theme
		if (theme) {
			setTheme(theme)
		} else {
			setTheme(ThemeValue.enum.light)
		}
	}

	const getTheme = () => current

	const setTheme = (theme: Theme) => {
		if (theme === ThemeValue.enum.dark) {
			document.body.classList.remove(ThemeValue.enum.light)
			document.body.classList.add(theme)
		} else {
			document.body.classList.remove(ThemeValue.enum.dark)
			document.body.classList.add(theme)
		}

		current.value = theme
		localStorage.setItem("theme", theme)
	}


	return { 
		setTheme, 
		init, 
		getTheme
	}
}