import "./globals.css"

export const metadata = {
  title: "YourLawyer",
  description: "AI-powered legal intelligence platform",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
