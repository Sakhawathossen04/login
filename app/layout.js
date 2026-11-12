import "./globals.css";
export const metadata = { title: "YourApp", description: "Login" };
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
