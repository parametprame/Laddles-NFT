import { useState, useEffect } from "react";
import ABI_MARKET from "../contract/abi_market.json";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";
import ABI from "../contract/abi.json";
import { ethers } from "ethers";
import axios from "axios";
import { useContractContext } from "../context/contract";

export const BuyNFT = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { account, active } = useWeb3React();
  const { message, errMsg, setMessage } = useContractContext();
  const [isPending, setIsPending] = useState(false);
  const [nft, setNFT] = useState<Array<Object>>([]);
  let { id } = useParams();

  const DecodeHexToDecimal = (_hex: any) => {
    const number = parseInt(_hex, 16);
    return number;
  };

  useEffect(() => {
    async function fetchItemInMarketplace() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0x2dC2635952F135E4a49a12d01655eBb6eb6F77A0",
        ABI_MARKET,
        provider
      );
      const items = await contract.getListings();
      items?.map((item: any, index: any) => {
        if (DecodeHexToDecimal(item?.tokenId._hex).toString() == id) {
          decodeData(item, index + 1);
        }
      });
    }

    fetchItemInMarketplace();
  }, []);

  async function decodeData(data: any, index: any) {
    {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xb078b1271d5b118aeffd2390d16183eb47d416fc",
        ABI,
        provider
      );
      const tokenURI = await contract.tokenURI(id);
      axios.get(`https://ipfs.io/ipfs/${tokenURI.slice(7)}`).then((res) => {
        setNFT([
          {
            data: data,
            imageData: res.data,
            index: index,
          },
        ]);
      });
    }
  }

  const setCollapsOpen = () => {
    setIsOpen(true);
  };
  const setCollapsOff = () => {
    setIsOpen(false);
  };

  const BuyNFT = async (index: any) => {
    const price = DecodeHexToDecimal(index.data.price._hex);
    const totalCostWei = price.toString();
    const totalGasLimit = "285000";
    if (active && account && !errMsg) {
      setIsPending(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          "0x2dC2635952F135E4a49a12d01655eBb6eb6F77A0",
          ABI_MARKET,
          signer
        );
        const transaction = await contract.buyToken(index.index, {
          value: totalCostWei,
          gasLimit: totalGasLimit.toString(),
        });
        await transaction.wait();
        window.location.replace("/mynfts");
        setIsPending(false);
      } catch (err) {
        setIsPending(false);
      }
    }
  };

  return (
    <>
      <main>
        {nft?.map((item) => {
          return (
            <div className="container mx-auto mt-10 ">
              <div className="flex grid grid-cols-2 gap-10 justify-center">
                <div className="row-span-2">
                  <img
                    className="object-cover h-5/6 w-full  shadow-xl rounded-2xl border"
                    src={`https://ipfs.io/ipfs/${Object(
                      item
                    ).imageData.image.slice(7)}`}
                  />
                </div>
                <div>
                  <div className="bg-white rounded-2xl border shadow-xl p-10 w-full">
                    <div className="flex flex-col items-center space-y-4 w-full">
                      <h1 className="font-bold text-2xl text-gray-700 w-full">
                        {nft?.map((item) => Object(item).imageData.name)}{" "}
                        {nft?.map((item) => Object(item).index)}
                      </h1>
                      <h3 className=" text-2xl text-gray-700 w-full">
                        Owner : {Object(item).data.seller.slice(0, 6)}
                      </h3>
                      <h1 className="font-bold text-2xl text-gray-700 w-full text-center">
                        Price :{" "}
                        {DecodeHexToDecimal(Object(item).data.price._hex) /
                          1000000000000000000}{" "}
                        ETH
                      </h1>
                      {isPending ? (
                        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full">
                          <span
                            className="spinner-border spinner-border-sm mr-3"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {"  "}
                          {isPending && "Pending..."}
                          {!isPending && "Processing.."}
                        </button>
                      ) : (
                        <>
                          {Object(item).data[0] === 1 ? (
                            <button
                              className="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed w-full"
                            >
                              Sold
                            </button>
                          ) : (
                            <button
                              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full"
                              onClick={() => BuyNFT(Object(item))}
                            >
                              Buy
                            </button>
                          )}
                        </>
                      )}
                    </div>
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
                      {Object(item).imageData.attributes?.map((att: any) => (
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                          {att?.trait_type} : {att?.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
};
