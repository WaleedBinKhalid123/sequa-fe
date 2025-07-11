import "./globals.css";
import ReduxProvider from "./storeProvider";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Sequoia Internal",
  description: "Internal dashboard for Sequoia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-dvh antialiased text-black bg-white">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
};
