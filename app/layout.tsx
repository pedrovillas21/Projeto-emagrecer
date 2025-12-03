import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Exemplo usando Inter em vez de Geist
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Protocolo Emagrecer",
    description: "Calculadora Científica",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
        {/* Adicione a classe 'antialiased' do Tailwind se quiser fontes mais nítidas */}
        <body className={`${inter.className} antialiased transition-colors duration-300`}>
        <ThemeProvider>
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}