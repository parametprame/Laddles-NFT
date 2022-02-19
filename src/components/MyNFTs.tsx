import ABI from "../contract/abi.json";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import axios from "axios";
import CheckApprove from "./CheckApprove";
export const MyNFTs = () => {
  const { account } = useWeb3React();
  const [mydataNFT, setNFTs] = useState<Array<any>>([]);

  useEffect(() => {
    async function fetchMyNFTs() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xb078b1271d5b118aeffd2390d16183eb47d416fc",
        ABI,
        provider
      );
      const myNFTs = await contract.walletOfOwner(account);
      myNFTs.map((data: any) => decodeData(data));
    }

    fetchMyNFTs();
  }, [account]);

  async function decodeData(data: any) {
    {
      const numberIndex = parseInt(data._hex, 16);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xb078b1271d5b118aeffd2390d16183eb47d416fc",
        ABI,
        provider
      );
      const tokenURI = await contract.tokenURI(numberIndex);
      axios.get(`https://ipfs.io/ipfs/${tokenURI.slice(7)}`).then((res) => {
        setNFTs((prev) => [...prev, res.data]);
      });
    }
  }

  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">MY NFTs</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8  h-screen">
          <div className="px-4 py-6 sm:px-0  h-full">
            <div className="border-4 border-dashed border-gray-500 rounded-lg h-max">
              <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {mydataNFT?.map((data) => (
                  <div className="rounded overflow-hidden shadow-lg flex flex-col">
                    <img
                      className="w-full"
                      src={`https://ipfs.io/ipfs/${data.image.slice(7)}`}
                      alt="nft"
                    />
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">{data.name}</div>
                    </div>
                    <div>
                      <Link to={`/viewnft/${data.edition}`}>
                      <button
                        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full"
                      >
                        View 
                      </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
