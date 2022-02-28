import Navbar from "./navigations/Navbar";
import { Hero } from "./components/Homepage";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { ContractProvider } from "../src/context/contract";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { MyNFTs } from "./components/MyNFTs";
import { Marketplace } from "./components/Marketplace";
import { ViewNFT } from "./components/ViewNFT";
import { BuyNFT } from "./components/BuyNFT";
import { MyNFTForsale } from "./components/MyNFTForsale";
import { Activity } from "./components/Activity"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider);
}

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/22355/marketplace-ladsdle/final",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
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
                <Route path="detail/:tokenId/:id" element={<MyNFTForsale />} />
                <Route path="activity" element={<Activity />} />
              </Routes>
            </BrowserRouter>
          </ContractProvider>
        </Web3ReactProvider>
      </ApolloProvider>
    </>
  );
}

export default App;
