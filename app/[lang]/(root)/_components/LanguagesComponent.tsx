'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'
import { LanguageSwitcherProps } from '@/types'

function LanguageSwitcher({ currentLang, dictionary }: LanguageSwitcherProps) {
	const router = useRouter()
	const pathname = usePathname()

	const switchLanguage = (newLang: 'en' | 'uz') => {
		const segments = pathname.split('/')
		segments[1] = newLang
		const newPath = segments.join('/')
		router.push(newPath)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='default' className='gap-2'>
					<Globe className='h-4 w-4' />
					{currentLang.toUpperCase()}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => switchLanguage('en')}>
					{dictionary.languages.english}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => switchLanguage('uz')}>
					{dictionary.languages.uzbek}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default LanguageSwitcher
