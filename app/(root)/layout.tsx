import type { ChildProps } from '@/types'
import Navbar from './_components/navbar'
import Footer from './_components/footer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import GlobalSearchMobile from './_components/global-search-mobile'

async function Layout({ children }: ChildProps) {
	const session = await getServerSession(authOptions)

	return (
		<div>
			{<Navbar session={session ?? { user: { id: '' } }} />}
			<div className='container'>
				{children}

				<div className='fixed bottom-20 right-5'>
					<GlobalSearchMobile />
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default Layout
