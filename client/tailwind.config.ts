import type { Config } from 'tailwindcss';

export default {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				primary: {
					DEFAULT: '#334155', // Slate blue-gray for primary elements
					dark: '#1e293b', // Darker slate blue-gray for hover or active states
				},
				onprimary: '#ffffff', // White text on primary background

				// Secondary Colors
				secondary: {
					DEFAULT: '#28303b', // Darker bluish-gray for secondary elements
					dark: '#1a2029', // Even darker bluish-gray for hover or active states
				},
				onsecondary: '#e5e7eb', // Dark gray text on secondary background

				// Accent Colors
				accent: {
					DEFAULT: '#f59e0b', // Amber for accent or highlight elements
					dark: '#b45309', // Darker amber for hover or active states
				},

				danger: {
					DEFAULT: '#b91c1c', // Muted dark red for danger elements
					dark: '#991b1b', // Darker red for hover or active states
				},

				// Text Colors
				text: {
					primary: '#1f2937', // Dark gray for primary text
					secondary: '#6b7280',
					foreground: '#ffffff', // Medium gray for secondary text
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
