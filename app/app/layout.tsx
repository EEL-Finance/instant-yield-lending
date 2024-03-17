import WalletContextWrapper from "./components/WalletContextWrapper";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletContextWrapper>
          <div className="h-screen flex flex-col justify-between">
            <Header />
            <div className="w-full h-full overflow-y-auto">
              {children}
            </div>
            <Footer />
          </div>
        </WalletContextWrapper>
      </body>
    </html>
  );
}
