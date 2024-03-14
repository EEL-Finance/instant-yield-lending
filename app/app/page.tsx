/* ------------------------- Imports ------------------------- */
// Frontend
import WalletContextWrapper from "./components/walletContextWrapper";
import Header from "./components/header";
import App from "./app";
// Web3


/* ------------------------ Components ----------------------- */
export default function Main() {
  return (
    <WalletContextWrapper>
      <div className="flex flex-col">
        <Header></Header>
        <App></App>
      </div>
    </WalletContextWrapper>
  );
}
