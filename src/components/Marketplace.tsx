import ABI_MARKET from "../contract/abi_market.json";
import ABI from "../contract/abi.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { Link } from "react-router-dom";

export const Marketplace = () => {
  const [marketplace, setMarketplace] = useState<Array<Object>>([]);

  useEffect(() => {
    async function fetchItemInMarketplace() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xD249EF5B03BE5aFEf933678Ae6A2fBE4C5788977",
        ABI_MARKET,
        provider
      );
      const items = await contract.getListings();
      items.map((data: any) => {
        if(data[0] !== 1 && data[0] !== 2) {
          decodeData(data)
        }
      });
    }

    fetchItemInMarketplace();
  }, []);

  const DecodeHexToDecimal = (_hex: any) => {
    const number = parseInt(_hex, 16);
    return number;
  };

  async function decodeData(data: any) {
    {
      const numberIndex = parseInt(data.tokenId._hex, 16);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xb078b1271d5b118aeffd2390d16183eb47d416fc",
        ABI,
        provider
      );
      const tokenURI = await contract.tokenURI(numberIndex);
      axios.get(`https://ipfs.io/ipfs/${tokenURI.slice(7)}`).then((res) => {
         
        setMarketplace((prev) => [...prev, {
          data : data,
          imageData: res.data
        }])
      });
    }
  }


  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8  h-screen">
          <div className="px-4 py-6 sm:px-0  h-full">
            <div className="border-4 border-dashed border-gray-500 rounded-lg h-max">
              <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {marketplace?.map((item) => (
                  <Link to={`/buynft/${DecodeHexToDecimal(Object(item).data.tokenId._hex)}`}>
                  <div className="rounded overflow-hidden shadow-lg flex flex-col ">
                    <img
                      className="w-full"
                      src={`https://ipfs.io/ipfs/${Object(item).imageData.image.slice(7)}`}
                      alt="nft"
                    />
                    <div className="px-6 py-4">
                      <div className="text-xl mb-2">
                        {" "}
                        <p className="font-bold text-sm	">
                          {" "}
                          Laddles{" "}
                          <span className="font-normal text-sm	">
                            #{DecodeHexToDecimal(Object(item).data.tokenId._hex)}
                          </span>
                        </p>
                      </div>
                      <div className="text-xl mb-2">
                        {" "}
                        <p className="font-bold text-sm	">
                          {" "}
                          Price :{" "}
                          <span className="font-normal text-sm	">
                            {DecodeHexToDecimal(Object(item).data.price._hex) /
                              10**9}{" "}
                            ETH
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="bg-black w-full">
                      <p className="font-bold text-sm	text-white px-6 py-1">
                        {" "}
                        Owner :{" "}
                        <span className="font-normal text-sm	text-white">
                          {Object(item).data.seller.slice(0, 6)}
                        </span>
                      </p>
                    </div>
                  </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
