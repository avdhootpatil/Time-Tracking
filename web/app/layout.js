import AppLayout from "@/lib/components/layout";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>
          {children} <Toaster />
        </AppLayout>
      </body>
    </html>
  );
}
