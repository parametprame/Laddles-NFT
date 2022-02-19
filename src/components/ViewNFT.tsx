import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";
import ABI from "../contract/abi.json";
import { ethers } from "ethers";
import axios from "axios";
import CheckApprove from "./CheckApprove";

export const ViewNFT = (props: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const [price, setPrice] = useState("");
  const { account } = useWeb3React();
  const [mydataNFT, setNFTs] = useState<Array<any>>([]);
  let { id } = useParams();

  useEffect(() => {
    async function fetchMyNFTs() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xb078b1271d5b118aeffd2390d16183eb47d416fc",
        ABI,
        provider
      );
      const tokenURI = await contract.tokenURI(id);
      axios.get(`https://ipfs.io/ipfs/${tokenURI.slice(7)}`).then((res) => {
        setNFTs(() => [res.data]);
      });
    }

    fetchMyNFTs();
  }, [account]);

  const setCollapsOpen = () => {
    setIsOpen(true);
  };
  const setCollapsOff = () => {
    setIsOpen(false);
  };


  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {mydataNFT[0]?.name}
          </h1>
        </div>
      </header>
      <main>
        <div className="container mx-auto mt-10 ">
          <div className="flex grid grid-cols-2 gap-10 justify-center">
            <div className="row-span-2">
              <img
                className="object-cover h-5/6 w-full  shadow-xl rounded-2xl border"
                src={`https://ipfs.io/ipfs/${mydataNFT[0]?.image.slice(7)}`}
              />
            </div>
            <div>
              <div className="bg-white rounded-2xl border shadow-xl p-10 w-full">
                <form action="">
                  <div className="flex flex-col items-center space-y-4 w-full">
                    <h1 className="font-bold text-2xl text-gray-700 w-full text-center">
                      List Price
                    </h1>
                    <p className="text-sm text-gray-500 text-center w-full">
                      ใส่เป็นจำนวนเต็มเท่านั้น ห้ามทศนิยม
                    </p>
                    <input
                      type="number"
                      placeholder="Price (ETH)"
                      className="border-2 rounded-lg w-full h-12 px-4"
                      min="1"
                      name="price"
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <CheckApprove tokenId={id}  price={price}/>
                  </div>
                </form>
              </div>
            </div>
            <div>
              <h2>
                <button
                  type="button"
                  className="flex items-center focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 justify-between p-5 w-full font-medium text-left border border-gray-200 dark:border-gray-700 border-b-0 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-t-xl"
                  onClick={() => {
                    isOpen ? setCollapsOff() : setCollapsOpen();
                  }}
                >
                  <span>Attributes</span>
                  <svg
                    data-accordion-icon=""
                    className="w-6 h-6 shrink-0 rotate-180"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </h2>
              <div className={isOpen ? "block" : "hidden"}>
                <div className="p-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 ">
                  {mydataNFT[0]?.attributes?.map((att: any) => (
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {att?.trait_type} : {att?.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
