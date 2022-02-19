import Navbar from "./navigations/Navbar";
import { Hero } from "./components/Heto";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { ContractProvider } from "../src/context/contract";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {MyNFTs} from './components/MyNFTs'
import { Marketplace } from "./components/Marketplace";
import { ViewNFT } from "./components/ViewNFT";
import { BuyNFT } from "./components/BuyNFT";

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider);
}

function App() {
  return (
    <>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ContractProvider>
          <Navbar />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="mynfts" element={<MyNFTs />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="viewnft/:id" element={<ViewNFT />} />
              <Route path="buynft/:id" element={<BuyNFT />} />
            </Routes>
          </BrowserRouter>
        </ContractProvider>
      </Web3ReactProvider>
    </>
  );
}

export default App;
