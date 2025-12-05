import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
// 1. Importação do Provider que criamos
import { CalculatorProvider } from "@/contexts/CalculatorContext";

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
        <body className={`${inter.className} antialiased transition-colors duration-300`}>
        <ThemeProvider>
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* 2. Envolvendo o conteúdo das páginas com o CalculatorProvider */}
            <CalculatorProvider>
                {children}
            </CalculatorProvider>

        </ThemeProvider>
        </body>
        </html>
    );
}