import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DuloraBite – Crafted with Love, Made to Delight',
  description: 'Premium homemade chocolates, cookies and lollipops. No preservatives. No palm oil. 100% Vegetarian.',
  keywords: 'homemade chocolates, cookies, lollipops, DuloraBite, premium sweets, gift box',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable}`}>
      <body className="bg-cream font-dm antialiased">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#3B1F0E',
              color: '#E8B96A',
              fontFamily: 'var(--font-dm)',
              fontSize: '14px',
              borderRadius: '8px',
              border: '1px solid rgba(200,151,58,0.3)',
            },
          }}
        />
      </body>
    </html>
  );
}
