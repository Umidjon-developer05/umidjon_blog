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
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ErrorPage() {
	const searchParams = useSearchParams()
	const error = searchParams.get('error')

	const errorTitle = 'Authentication Error'
	let errorMessage = 'An error occurred during authentication.'

	// Handle specific error types
	switch (error) {
		case 'AccessDenied':
			errorMessage =
				"You don't have permission to access this resource or your GitHub email might be private."
			break
		case 'Configuration':
			errorMessage = 'There is a problem with the server configuration.'
			break
		case 'Verification':
			errorMessage =
				'The verification token has expired or has already been used.'
			break
		case 'OAuthSignin':
			errorMessage = 'Error in the OAuth sign-in process.'
			break
		case 'OAuthCallback':
			errorMessage = 'Error in the OAuth callback process.'
			break
		case 'OAuthCreateAccount':
			errorMessage = 'Could not create OAuth account.'
			break
		case 'EmailCreateAccount':
			errorMessage = 'Could not create email account.'
			break
		case 'Callback':
			errorMessage = 'Error in the callback handler.'
			break
		case 'OAuthAccountNotLinked':
			errorMessage = 'This email is already associated with another account.'
			break
		case 'EmailSignin':
			errorMessage = 'Error sending the email sign-in link.'
			break
		case 'CredentialsSignin':
			errorMessage = 'The email or password you entered is incorrect.'
			break
		default:
			errorMessage = 'An unknown error occurred during authentication.'
	}

	return (
		<div className='flex min-h-screen items-center justify-center p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle className='text-2xl text-center text-red-500'>
						{errorTitle}
					</CardTitle>
					<CardDescription className='text-center'>
						{errorMessage}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<p className='text-sm text-muted-foreground'>
							If youre using GitHub authentication and seeing an error, please
							make sure your email is public in your GitHub settings or try
							using Google authentication instead.
						</p>
						<p className='text-sm text-muted-foreground'>
							For GitHub users: Go to GitHub Settings → Emails → Make sure Keep
							my email addresses private is unchecked or add a public email.
						</p>
					</div>
				</CardContent>
				<CardFooter className='flex justify-center gap-4'>
					<Button asChild variant='outline'>
						<Link href='/login'>Try Again</Link>
					</Button>
					<Button asChild>
						<Link href='/'>Go Home</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
