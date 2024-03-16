/* ------------------------- Imports ------------------------- */
// Frontend
import WalletContextWrapper from "./components/walletContextWrapper";
import Header from "./components/header";
import Footer from "./components/footer";
import Link from 'next/link';

/* ------------------------ Components ----------------------- */
export default function Main() {
  return (
    <WalletContextWrapper>
      <div className="h-screen flex flex-col justify-between">
        <Header />
          <Link href="/app">Go to Dashboard</Link>
        <Footer />
      </div>
    </WalletContextWrapper>
  );
}
