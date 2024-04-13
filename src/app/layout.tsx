import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers';

import Providers from '@/redux/provider'

import './globals.css'
import 'ckeditor5-custom-build/build/styles.css'
import '@/components/editor/wysiwig/styles/dark-style.css'
import '@/components/editor/wysiwig/styles/prism.css'
import '@/components/editor/wysiwig/styles/content.scss'

import Structure from '@/app/structure'
import config from '@/config';
import { Toaster } from '@/components/ui/toaster';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from './api/auth/[...nextauth]/authOptions';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';

// Add your custom fonts here
const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(nextAuthOptions);

    const cookieStore = cookies();
    const theme = cookieStore.get(config.theme_key);

    return (
        <html lang='en'>
            <body className={`${inter.className} ${theme?.value || "dark"}`}>
                <Providers theme={theme?.value} session={session}>
                    <Structure theme={theme?.value || "dark"}>
                        {children}
                        <Toaster />
                    </Structure>
                </Providers>
            </body>
        </html>
    )
}

/**
 * Metadata for the page
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
    title: {
        default: config.name,
        template: `%s • ${config.name}`,
    },
    applicationName: config.name,
    appleWebApp: {
        title: config.name,
        statusBarStyle: 'black-translucent',
        capable: true,
    },
    colorScheme: 'dark light',
    creator: config.author,
    publisher: config.author,
    referrer: 'origin-when-cross-origin',
    description: config.description,
    icons: {
        icon: [
            ...config.icons.map((icon) => ({
                url: icon.href,
                sizes: icon.sizes,
                type: icon.type,
                rel: icon.rel,
            }) as Icon),
        ],
    },
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f6f8fa' },
        { media: '(prefers-color-scheme: dark)', color: '#161b22' },
    ],
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: true,
    },
    robots: {
        index: false,
        follow: false,
        nocache: false,
        notranslate: true,
        noarchive: false,
        "max-image-preview": "standard",
        "max-snippet": 200,
        "max-video-preview": 1,
        noimageindex: false,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: false,
            'max-video-preview': 1,
            'max-image-preview': 'standard',
            'max-snippet': 200,
        },
    },
    other: {
        'Content-Type': 'text/html;charset=UTF-8',
        'X-UA-Compatible': 'IE=7; IE=edge',
    },
};

