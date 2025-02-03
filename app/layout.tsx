import "@/app/ui/global.css";
import { montserrat } from "./ui/fonts";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        {children}
        <footer className="bg-red-400 w-full h-[30px]">
          Este es el layout y la prueba del segundo commit
        </footer>
      </body>
    </html>
  );
}
