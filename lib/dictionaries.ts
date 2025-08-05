import 'server-only'

const dictionaries = {
	en: () => import('../dictionaries/en.json').then(module => module.default),
	uz: () => import('../dictionaries/uz.json').then(module => module.default),
}

export const getDictionary = async (locale: 'en' | 'uz') => {
	return dictionaries[locale]?.() ?? dictionaries.en()
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
