'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut } from 'next-auth/react'

interface UserProfileProps {
	user: {
		name?: string | null
		email?: string | null
		image?: string | null
	}
}

export function UserProfile({ user }: UserProfileProps) {
	return (
		<Card className='w-full max-w-md'>
			<CardHeader className='flex flex-row items-center gap-4'>
				<Avatar className='h-14 w-14'>
					<AvatarImage src={user.image || ''} alt={user.name || 'User'} />
					<AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
				</Avatar>
				<div>
					<CardTitle>{user.name}</CardTitle>
					<CardDescription>{user.email}</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<p className='text-center text-muted-foreground'>
					You are now logged in to Umidjon Blog. You can start creating and
					sharing your content.
				</p>
			</CardContent>
			<CardFooter className='flex justify-between'>
				<Button
					variant='outline'
					onClick={() => (window.location.href = '/dashboard')}
				>
					Go to Dashboard
				</Button>
				<Button
					variant='destructive'
					onClick={() => signOut({ callbackUrl: '/' })}
				>
					Sign Out
				</Button>
			</CardFooter>
		</Card>
	)
}
