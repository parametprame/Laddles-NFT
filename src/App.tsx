import Navbar from "./navigations/Navbar";
import { Hero } from "./components/Heto";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { ContractProvider } from "../src/context/contract";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {MyNFTs} from './components/MyNFTs'

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
            </Routes>
          </BrowserRouter>
        </ContractProvider>
      </Web3ReactProvider>
    </>
  );
}

export default App;
