import { Dictionary } from '@/lib/dictionaries'

export interface ChildProps {
	children: React.ReactNode
}

export interface IArchivedBlog {
	year: string
	blogs: IBlog[]
}

export interface IBlog {
	title: string
	description: string
	author: IAuthor
	category: ICategoryAndTags
	tag: ICategoryAndTags
	image: { url: string }
	createdAt: string
	content: { html: string }
	slug: string
}

export interface IAuthor {
	name: string
	image: { url: string }
	bio: string
	blogs: IBlog[]
	id: string
}

export interface ICategoryAndTags {
	name: string
	slug: string
	blogs: IBlog[]
}

export interface LoginProps {
	dictionary: {
		login: {
			login: string
			title: string
			subtitle: string
		}
	}
}

export interface NavbarProps {
	session: {
		user: {
			id: string
			name?: string | null
			email?: string | null
			image?: string | null
		}
	}
	lang: 'en' | 'uz'
	dictionary: Dictionary
}

export interface UserProfileProps {
	user: {
		name?: string | null
		email?: string | null
		image?: string | null
	}
}

export interface LanguageSwitcherProps {
	currentLang: 'en' | 'uz'
	dictionary: {
		languages: {
			switchLanguage: string
			english: string
			uzbek: string
		}
	}
}
