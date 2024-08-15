import type {Config} from 'tailwindcss';
import {nextui} from '@nextui-org/react';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                'foreground-rgb': '#FFFFFF',
                'background-color': '#000000',
                'secondary-color': '#888888',
                'text-color': '#FFFFFF',
                'error-color': '#FF3E2D',
                'layout-bg-color': '#131315',
                'primary-button-bg-color': '#FFFFFF',
                'primary-button-fg-color': '#000000',
                'secondary-button-bg-color': '#141414',
                'secondary-button-fg-color': '#FFFFFF',
                'warning-container-border': '#AA7C23',
            },
        },
    },
    darkMode: 'class',
    plugins: [nextui()],
};
export default config;
