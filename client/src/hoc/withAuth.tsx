'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = <P extends object>(Component: ComponentType<P>) => {
	const Auth = (props: P) => {
		const { user, loading } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (!loading && !user) {
				router.push('/login');
			}
		}, [user, loading, router]);

		if (loading)
			return (
				<div className='w-full flex justify-center items-center'>
					<svg
						className='animate-spin h-5 w-5 mr-3 text-foreground'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'></circle>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
					</svg>
					Processing...
				</div>
			);

		return user ? <Component {...props} /> : null;
	};

	return Auth;
};

export default withAuth;
