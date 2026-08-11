import "./globals.css";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata = {
  title: "DiabetesEdu - Edukasi Diabetes Interaktif",
  description: "Aplikasi edukasi digital interaktif untuk pencegahan diabetes melitus",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
            <PageTransition>{children}</PageTransition>
          </main>
        </AuthProvider>
        <footer className="text-center text-xs text-slate-400 py-6">
          DiabetesEdu — Aplikasi edukasi digital, bukan pengganti konsultasi medis.
        </footer>
      </body>
    </html>
  );
}
