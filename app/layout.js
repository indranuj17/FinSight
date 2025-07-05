import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/page";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "FinSight AI",
  description: "Finance + Insight",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.className} flex flex-col min-h-screen`}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Toaster richColors/>
          {/* <footer className="bg-blue-50 py-12">
            <div className="container text-center mx-auto px-4 text-gray-600">
              <p>Made with love by Indranuj</p>
            </div>
          </footer> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
