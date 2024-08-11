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
                'secondary-button-bg-color': '#FFFFFF14',
                'secondary-button-fg-color': '#FFFFFF',
                'white-opacity-2': '#FFFFFF05',
                'white-opacity-4': '#FFFFFF0A',
                'white-opacity-6': '#FFFFFF0F',
                'white-opacity-8': '#FFFFFF14',
                'white-opacity-12': '#FFFFFF1F',
                'white-opacity-20': '#FFFFFF33',
                'white-opacity-60': '#FFFFFF99',
                'color-666': '#666666',
                'project-bg-color': '#0000003D',
                'selected-image-border-color': '#FFFFFFCC',
                'button-border-color': '#D1D5DA',
                'warning-container-background': '#AA7C2314',
                'warning-container-border': '#AA7C23',
            },
        },
    },
    darkMode: 'class',
    plugins: [nextui()],
};
export default config;
