import './globals.css';

export const metadata = {
  title: 'Moire — Your Virtual Closet',
  description: 'Catalog and organize everything you own.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900">{children}</body>
    </html>
  );
}
