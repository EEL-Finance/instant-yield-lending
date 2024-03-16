/* ------------------------- Imports ------------------------- */
// Frontend
import WalletContextWrapper from "./components/walletContextWrapper";
import Header from "./components/header";
import Footer from "./components/footer";
import App from "./app";
// Web3


/* ------------------------ Components ----------------------- */
export default function Main() {
  return (
    <WalletContextWrapper>
      <div className="h-screen flex flex-col justify-between">
        <Header />
        <App />
        <Footer />
      </div>
    </WalletContextWrapper>
  );
}
