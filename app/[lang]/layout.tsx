import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import { Crete_Round, Work_Sans } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
const creteRound = Crete_Round({
	weight: ['400'],
	subsets: ['latin'],
	variable: '--font-creteRound',
})
const workSans = Work_Sans({
	weight: ['500', '600'],
	subsets: ['latin'],
	variable: '--font-workSans',
})

export const metadata: Metadata = {
	metadataBase: new URL('https://umidjon.site'),
	title: 'Umidjon dasturlashga oid maqolalar',
	description:
		'Dasturlash haqida yangiliklar, maslahatlar, va dasturlash sohasidagi eng soʻnggi xabarlar. Bizning blogda dasturlashni oʻrganish va rivojlantirish uchun qoʻllanma topishingiz mumkin.',
	authors: [{ name: 'Umidjon Gafforov', url: 'https://umidjon.site' }],
	icons: {
		icon: '/favicon.png',
		shortcut: '/favicon.png',
		apple: '/favicon.png',
	},
	keywords:
		"Umidjon Gafforov, umidjon, dasturlash kurslari, dasturlashga oid darslar, reactjs uzbek tilida, vuejs uzbek tilida, redux uzbek tilida, umidjon, umidjon academy, bepul dasturlash, rezyume yozish, portfolio, umidjon javascript, umidjon raqamli avlod, javascript, reactjs, vuejs, javascript darslari, reactjs darslari, vuejs darslari, dasturlash darslari, o'zbek tilida dasturlash, reactjs o'zbek tilida, reactjs darslari o'zbek tilida, javascript darslari, javascript darslari o'zbek tilida, dasturash darslari o'zbek tilida, dasturlashni o'rganish, dasturlash, IT loyihalar o'zbek tilida",
	openGraph: {
		title: 'umidjon dasturlashga oid maqolalar',
		description:
			'Dasturlash haqida yangiliklar, maslahatlar, va dasturlash sohasidagi eng soʻnggi xabarlar. Bizning blogda dasturlashni oʻrganish va rivojlantirish uchun qoʻllanma topishingiz mumkin.',
		type: 'website',
		url: 'https://umidjon.site',
		locale: 'en_EN',
		images:
			'https://0evi7lr5v8.ufs.sh/f/LN78d9BJu8QkU2FhAc05evHGXpqZ4SA9ilT8VdO3PBtIKJxk',
		countryName: 'Uzbekistan',
		siteName: 'umidjon',
		emails: 'info@umidjon.site',
	},
}

export async function generateStaticParams() {
	return [{ lang: 'en' }, { lang: 'uz' }]
}

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ lang: 'en' | 'uz' }>
}) {
	const { lang } = await params
	return (
		<html lang={lang} suppressHydrationWarning>
			<body
				className={`${creteRound.variable} ${workSans.variable} overflow-x-hidden`}
			>
				<AuthProvider>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
						storageKey='blog-theme'
					>
						<NextTopLoader showSpinner={false} />
						{children}
						<Toaster position='top-center' />
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	)
}
