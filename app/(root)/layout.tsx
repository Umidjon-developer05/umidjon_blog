import type { ChildProps } from '@/types'
import Navbar from './_components/navbar'
import Footer from './_components/footer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'

async function Layout({ children }: ChildProps) {
	const session = await getServerSession(authOptions)

	return (
		<div>
			{<Navbar session={session ?? { user: { id: '' } }} />}
			<div className='container'>{children}</div>
			<Footer />
		</div>
	)
}

export default Layout
