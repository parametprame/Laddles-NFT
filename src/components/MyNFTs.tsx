import ABI from "../contract/abi.json";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import axios from "axios";

export const MyNFTs = () => {
  const { account } = useWeb3React();
  const [mydataNFT, setNFTs] = useState<Array<any>>([]);

  useEffect(() => {
    async function fetchMyNFTs() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xa632D4028fb12c4D53c5cEDa08188b949427Da6f",
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
        "0xa632D4028fb12c4D53c5cEDa08188b949427Da6f",
        ABI,
        provider
      );
      const tokenURI = await contract.tokenURI(numberIndex);
      axios.get(`https://ipfs.io/ipfs/${tokenURI.slice(7)}`).then((res) => {
        setNFTs((prev) => [...prev, res.data]);
      });
    }
  }

  console.log(mydataNFT);

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
                  <div className="rounded overflow-hidden shadow-lg">
                    <img
                      className="w-full"
                      src={`https://ipfs.io/ipfs/${data.image.slice(7)}`}
                      alt="Mountain"
                    />
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">{data.name}</div>
                    </div>
                    <div className="px-6 pt-4 pb-2">
                      {data?.attributes?.map((att : any) => (
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                          {att.trait_type} : {att.value}
                        </span>
                      ))}
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
