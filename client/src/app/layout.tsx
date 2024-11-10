'use client';

import './globals.css';
import { ubuntu } from './ui/fonts';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
	faHouse,
	faMoneyBillWave,
	faPiggyBank,
	faList,
	faArrowRightFromBracket,
	faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<AuthProvider>
				<MainLayout>{children}</MainLayout>
			</AuthProvider>
		</html>
	);
}

function MainLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	const noSidebarRoutes = ['/login', '/register'];

	const showAuthComponents = !noSidebarRoutes.includes(pathname);

	const { logout } = useAuth();

	return (
		<body className={`${ubuntu.className} antialiased flex`}>
			{showAuthComponents && (
				<aside className='w-[280px] bg-primary h-full fixed flex flex-col items-center'>
					<div className='font-bold text-3xl py-8 text-center'>
						<h2>Expense</h2>
						<h2>Tracker</h2>
					</div>
					<ul className='w-full flex-grow'>
						<SidebarLink
							href='/'
							icon={faHouse}
							label='Dashboard'
						/>
						<SidebarLink
							href='/expenses'
							icon={faMoneyBillWave}
							label='Expenses'
						/>
						<SidebarLink
							href='/incomes'
							icon={faPiggyBank}
							label='Incomes'
						/>
						<SidebarLink
							href='/categories'
							icon={faList}
							label='Categories'
						/>
					</ul>
					<div className='w-full'>
						<SidebarLink
							onclick={logout}
							icon={faArrowRightFromBracket}
							label='Log Out'
							className='mt-auto mb-8'
						/>
					</div>
				</aside>
			)}
			<div className='flex flex-col w-full h-full'>
				{showAuthComponents && (
					<div className='w-full h-16 border-b border-white border-solid'></div>
				)}
				<main
					className={`${
						showAuthComponents ? 'ml-[280px]' : 'w-full'
					} p-8`}>
					{children}
					{showAuthComponents && <FAB />}
				</main>
			</div>
		</body>
	);
}

interface SidebarLinkProps {
	href?: string;
	icon: IconDefinition;
	label: string;
	onclick?: () => void;
	className?: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
	href = '',
	icon,
	label,
	onclick,
	className = '',
}) => {
	return (
		<li
			className={`h-[72px] px-16 flex hover:bg-primary-lighter ${className}`}
			onClick={onclick}>
			{href ? (
				<Link
					href={href}
					className='flex justify-start gap-4 items-center'>
					<FontAwesomeIcon icon={icon} />
					<span>{label}</span>
				</Link>
			) : (
				<button
					onClick={onclick}
					className='flex justify-start gap-4 items-center w-full text-left'>
					<FontAwesomeIcon icon={icon} />
					<span>{label}</span>
				</button>
			)}
		</li>
	);
};

const FAB: React.FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const router = useRouter();

	const handleCreateExpense = () => {
		setIsOpen(false);
		router.push('/expenses/create');
	};

	const handleCreateIncome = () => {
		setIsOpen(false);
		router.push('/incomes/create');
	};
	return (
		<div className='fixed bottom-8 right-8 cursor-pointer text-2xl'>
			<div className='flex flex-col items-end space-y-2 mb-2'>
				<div
					className={`relative flex items-center group transition-all duration-300 ${
						isOpen
							? 'translate-y-0 opacity-100 pointer-events-auto'
							: 'translate-y-10 opacity-0 pointer-events-none invisible'
					}`}>
					<span className='absolute right-[72px] transition-all duration-300 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 bg-primary px-2 py-1 rounded-md text-sm whitespace-nowrap'>
						Create Expense
					</span>
					<button
						onClick={handleCreateExpense}
						className='rounded-full w-16 h-16 flex justify-center items-center bg-primary hover:bg-primary-dark'>
						<FontAwesomeIcon icon={faMoneyBillWave} />
					</button>
				</div>
				<div
					className={`relative flex items-center group transition-all duration-300 ${
						isOpen
							? 'translate-y-0 opacity-100 pointer-events-auto'
							: 'translate-y-14 opacity-0 pointer-events-none invisible'
					}`}>
					<span className='absolute right-[72px] transition-all duration-300 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 bg-primary px-2 py-1 rounded-md text-sm whitespace-nowrap'>
						Create Income
					</span>
					<button
						onClick={handleCreateIncome}
						className='rounded-full w-16 h-16 flex justify-center items-center bg-primary hover:bg-primary-dark'>
						<FontAwesomeIcon icon={faPiggyBank} />
					</button>
				</div>
			</div>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`transition-all duration-500 rounded-full w-16 h-16 flex justify-center items-center bg-primary hover:bg-primary-dark ${
					isOpen ? 'rotate-[135deg]' : ''
				}`}>
				<FontAwesomeIcon icon={faPlus} />
			</button>
		</div>
	);
};
