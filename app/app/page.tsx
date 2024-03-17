/* ------------------------- Imports ------------------------- */
// Frontend
import WalletContextWrapper from "./components/WalletContextWrapper";
import Container from "./components/Container";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from 'next/link';

/* ------------------------ Components ----------------------- */
export default function Main() {
  return (
    <WalletContextWrapper>
      <div className="h-screen flex flex-col justify-between">
        <Header />
        <Container>
            <div className='grid lg:grid-cols-2 mt-12 gap-8 px-4 lg:px-0 items-center justify-center'>
              <div className='flex mb-12  flex-col justify-center'>
                <h1 className='text-4xl lg:text-6xl font-bold mb-6'>
                  Instant Yield Lending (IYL)
                </h1>
                <p className='mb-6 text-slate-400 max-w-lg lg:text-lg'>Offers users immediate access to funds without selling their crypto assets or relying on loans. Users contribute capital, receiving instant access to their desired amount. This capital is locked and invested, generating a constant APY until it covers the requested sum, providing a unique financial solution in the crypto space.</p>
                <div>
                <Link href='/app'>
                  <button className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Go to Dashboard
                  </button>
                </Link>
                </div>

              </div>
              <div>
                <img className='p-4' src='/logo.png' alt='logo-image' />
              </div>
          </div>
        </Container>
        <Footer />
      </div>
    </WalletContextWrapper>
  );
}
