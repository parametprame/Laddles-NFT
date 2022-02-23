import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";
import ABI from "../contract/abi.json";
import { ethers } from "ethers";
import axios from "axios";
import ABI_MARKET from "../contract/abi_market.json";
import { useContractContext } from "../context/contract";

export const MyNFTForsale = (props: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const [nftSelling, setNFTsSelling] = useState<Array<any>>([]);
  const [offers, setOffers] = useState<Array<any>>([]);
  let { id, tokenId } = useParams();
  const { chainId, account, active, library } = useWeb3React();
  const [isPending, setIsPending] = useState(false);
  const { message, errMsg, setMessage } = useContractContext();

  const DecodeHexToDecimal = (_hex: any) => {
    const number = parseInt(_hex, 16);
    return number;
  };

  async function decodeDataForsale(data: any) {
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
        setNFTsSelling([
          {
            data: data,
            imageData: res.data,
          },
        ]);
      });
    }
  }

  useEffect(() => {
    async function fetchItemInMarketplace() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xD249EF5B03BE5aFEf933678Ae6A2fBE4C5788977",
        ABI_MARKET,
        provider
      );
      const items = await contract.getListings();
      items.map((data: any, index: any) => {
        if (data[0] !== 1 && data[0] !== 2) {
          const checktoken = DecodeHexToDecimal(data.tokenId._hex);
          if (checktoken.toString() == tokenId) {
            decodeDataForsale(data);
          }
        }
      });
    }

    async function fetchOffer() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xD249EF5B03BE5aFEf933678Ae6A2fBE4C5788977",
        ABI_MARKET,
        provider
      );
      const items = await contract.showOfferforListitem(id);
      setOffers(items);
    }

    fetchItemInMarketplace();
    fetchOffer();
  }, [account]);

  const setCollapsOpen = () => {
    setIsOpen(true);
  };
  const setCollapsOff = () => {
    setIsOpen(false);
  };

  const AcceptOffer = async (index: any) => {
    if (active && account && !errMsg) {
        setIsPending(true);
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            "0xD249EF5B03BE5aFEf933678Ae6A2fBE4C5788977",
            ABI_MARKET,
            signer
          );
          const transaction = await contract.acceptOffer(id, index.toString());
          await transaction.wait();
          setIsPending(false);
          window.location.replace("/mynfts");
        } catch (err) {
          setIsPending(false);
        }
      }
  }

  const CancelSelling = async (e: any) => {
    e.preventDefault();
    if (active && account && !errMsg) {
      setIsPending(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          "0xD249EF5B03BE5aFEf933678Ae6A2fBE4C5788977",
          ABI_MARKET,
          signer
        );
        const transaction = await contract.cancel(id);
        await transaction.wait();
        setIsPending(false);
        window.location.replace("/mynfts");
      } catch (err) {
        setIsPending(false);
      }
    }
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {nftSelling[0]?.imageData?.name}
          </h1>
        </div>
      </header>
      <main>
        <div className="container mx-auto mt-10 py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex grid grid-cols-2 gap-10 justify-center">
            <div className="row-span-2">
              <img
                className="object-cover h-5/6 w-full  shadow-xl rounded-2xl border"
                src={`https://ipfs.io/ipfs/${nftSelling[0]?.imageData.image.slice(
                  7
                )}`}
              />
            </div>
            <div>
              <div className="bg-white rounded-2xl border shadow-xl p-10 w-full">
                <form action="">
                  <div className="flex flex-col items-center space-y-4 w-full">
                    <h1 className="font-bold text-2xl text-gray-700 w-full text-center">
                      List Price
                    </h1>
                    <input
                      type="number"
                      placeholder="Price (ETH)"
                      className="border-2 rounded-lg w-full h-12 px-4 "
                      min="1"
                      name="price"
                      step="0.01"
                      value={
                        DecodeHexToDecimal(nftSelling[0]?.data?.price._hex) /
                        10 ** 9
                      }
                      disabled
                    />
                    {isPending ? (
                      <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded w-full">
                        {" "}
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
                      <button
                        className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded w-full"
                        onClick={CancelSelling}
                      >
                        Cancel
                      </button>
                    )}
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
                  {nftSelling[0]?.imageData?.attributes?.map((att: any) => (
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {att?.trait_type} : {att?.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col col-span-2 pd-5">
              <h1 className="font-bold text-2xl text-gray-700 w-full text-center mb-5">
                {" "}
                Offers{" "}
              </h1>
              <div className="overflow-x-auto shadow-md sm:rounded-lg mb-30">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden ">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th
                            scope="col"
                            className=" text-center py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            Address
                          </th>
                          <th
                            scope="col"
                            className=" text-center py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className=" text-center py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            Accept Offer
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {offers.map((item, index) => (
                          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="py-4 px-6 text-sm text-center font-medium text-gray-500 whitespace-nowrap dark:text-white">
                              {item[0]}
                            </td>
                            <td className="py-4 px-6 text-sm text-center font-medium text-gray-500 whitespace-nowrap dark:text-white">
                              {DecodeHexToDecimal(item[1]._hex) / 10 ** 9} ETH
                            </td>
                            <td className="py-4 px-6 text-sm text-center font-medium text-gray-500 whitespace-nowrap dark:text-white">
                              <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={() => {AcceptOffer(index)}}>
                                Accept
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
