import "./globals.css";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import { AuthProvider } from "@/lib/AuthContext";
import { ThemeProvider } from "@/lib/ThemeContext";

export const metadata = {
  title: "DiabetesEdu - Edukasi Diabetes Interaktif",
  description: "Aplikasi edukasi digital interaktif untuk pencegahan diabetes melitus",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
              <PageTransition>{children}</PageTransition>
            </main>
          </AuthProvider>
        </ThemeProvider>
        <footer className="text-center text-xs text-slate-400 dark:text-slate-500 py-6">
          DiabetesEdu — Aplikasi edukasi digital, bukan pengganti konsultasi medis.
        </footer>
      </body>
    </html>
  );
}
