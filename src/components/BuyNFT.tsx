import { useState, useEffect } from "react";
import ABI_MARKET from "../contract/abi_market.json";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";
import ABI from "../contract/abi.json";
import { ethers } from "ethers";
import axios from "axios";
import { useContractContext } from "../context/contract";
import { gql, useQuery } from "@apollo/client";

const HSITORIES_NFT = gql`
  query historyNFt($tokenId: String!) {
    historyNFt(id: $tokenId) {
      id
      sales {
        buyer
        seller
        price
      }
    }
  }
`;

export const BuyNFT = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { account, active } = useWeb3React();
  const { message, errMsg, setMessage } = useContractContext();
  const [isPending, setIsPending] = useState(false);
  const [isPendingOffer, setIsPendingOffer] = useState(false);
  const [nft, setNFT] = useState<Array<Object>>([]);
  const [offers, setOffers] = useState<Array<any>>([]);

  const [offerPrice, setPriceOffer] = useState("");
  let { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const contractMarketplace = "0xd76978ba8518D70f73A74e43Ec2e5bb4483DCc7b";
  const contractToken = "0xb078b1271d5b118aeffd2390d16183eb47d416fc";

  const DecodeHexToDecimal = (_hex: any) => {
    const number = parseInt(_hex, 16);
    return number;
  };

  const encode = ethers.BigNumber.from(id);
  const tokenId = encode._hex;
  const { loading, error, data } = useQuery(HSITORIES_NFT, {
    variables: {
      tokenId,
    },
  });

  useEffect(() => {
    async function fetchItemInMarketplace() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xd76978ba8518D70f73A74e43Ec2e5bb4483DCc7b",
        ABI_MARKET,
        provider
      );
      const items = await contract.getListings();
      items?.map((item: any, index: any) => {
        if (
          DecodeHexToDecimal(item?.tokenId._hex).toString() === id &&
          item?.status === 0
        ) {
          decodeData(item, index + 1);
          fetchOffer(index + 1);
        }
      });
    }
    fetchItemInMarketplace();
  }, []);

  async function fetchOffer(index: any) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      "0xd76978ba8518D70f73A74e43Ec2e5bb4483DCc7b",
      ABI_MARKET,
      provider
    );
    const offers = await contract.showOfferforListitem(index);
    setOffers(offers);
  }

  async function decodeData(data: any, index: any) {
    {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractToken, ABI, provider);
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
    const price = DecodeHexToDecimal(index.data.price._hex).toString();
    const totalCostWei = ethers.utils.parseUnits(price, "gwei");
    const totalGasLimit = "285000";
    if (active && account && !errMsg) {
      setIsPending(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractMarketplace,
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

  const MakeOffer = async (index: any) => {
    const listingId = index.index.toString();
    const price = ethers.utils.parseUnits(offerPrice, "gwei");

    const totalCostWei = ethers.utils.parseUnits(offerPrice, 18);
    const totalGasLimit = "3000000";
    if (active && account && !errMsg) {
      setIsPendingOffer(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractMarketplace,
          ABI_MARKET,
          signer
        );
        const transaction = await contract.offer(price, listingId, {
          value: totalCostWei,
          gasLimit: totalGasLimit,
        });
        await transaction.wait();
        window.location.reload();
        setIsPendingOffer(false);
        setShowModal(false);
      } catch (err) {
        setIsPendingOffer(false);
      }
    }
  };

  if (loading) return <>...losding</>;

  return (
    <>
      <main>
        {nft?.map((item) => {
          return (
            <div className="container mx-auto mt-5  py-6 px-4 sm:px-6 lg:px-8 ">
              <div className="flex grid grid-cols-2 gap-5 justify-center">
                <div className="row-span-2">
                  <img
                    className="object-cover h-5/6 w-full  shadow-xl rounded-2xl border"
                    src={`https://ipfs.io/ipfs/${Object(
                      item
                    ).imageData.image.slice(7)}`}
                  />
                </div>
                <div className="">
                  <div className="bg-white rounded-2xl border shadow-xl p-10 w-full">
                    <div className="flex flex-col items-center space-y-4 w-full">
                      <h1 className="font-bold text-2xl text-gray-700 w-full">
                        {nft?.map((item) => Object(item).imageData.name)}
                      </h1>
                      <h3 className=" text-2xl text-gray-700 w-full">
                        Owner : {Object(item).data.seller.slice(0, 6)}
                      </h3>
                      <h1 className="font-bold text-2xl text-gray-700 w-full text-center">
                        Price :{" "}
                        {ethers.utils.formatUnits(
                          Object(item).data.price._hex,
                          "gwei"
                        )}{" "}
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
                            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed w-full">
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
                      <button
                        className="bg-violet-500 hover:bg-violet-400 text-white font-bold py-2 px-4 border-b-4 border-violet-700 hover:border-violet-500 rounded w-full"
                        onClick={() => setShowModal(true)}
                      >
                        Make Offer
                      </button>
                      {showModal ? (
                        <>
                          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                              {/*content*/}
                              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                  <h3 className="text-3xl font-semibold">
                                    Make Offer
                                  </h3>
                                  <button
                                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={() => setShowModal(false)}
                                  >
                                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                      ×
                                    </span>
                                  </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                  <form action="">
                                    <div className="flex flex-col items-center space-y-4 w-full">
                                      <h1 className="font-bold text-2xl text-gray-700 w-full text-center">
                                        Offer Price
                                      </h1>
                                      <input
                                        type="number"
                                        placeholder="Price (ETH)"
                                        className="border-2 rounded-lg w-full h-12 px-4"
                                        min="1"
                                        name="price"
                                        step="0.01"
                                        onChange={(e) =>
                                          setPriceOffer(e.target.value)
                                        }
                                      />
                                    </div>
                                  </form>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                  <button
                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                  >
                                    Close
                                  </button>

                                  {isPendingOffer ? (
                                    <button
                                      className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-4 border-b-4 border-emerald-700 hover:border-emerald-500 rounded w-full"
                                      type="button"
                                    >
                                      <span
                                        className="spinner-border spinner-border-sm mr-3"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                      {"  "}
                                      {isPendingOffer && "Pending..."}
                                      {!isPendingOffer && "Processing.."}
                                    </button>
                                  ) : (
                                    <button
                                      className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-4 border-b-4 border-emerald-700 hover:border-emerald-500 rounded w-full"
                                      type="button"
                                      onClick={() => MakeOffer(Object(item))}
                                    >
                                      Make Offer
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="mb-20">
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
                <div className="flex flex-col  pd-5">
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
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {offers.map((item) => (
                              <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="py-4 px-6 text-sm text-center font-medium text-gray-500 whitespace-nowrap dark:text-white">
                                  {item[0].slice(0, 5) +
                                    "..." +
                                    item[0].substring(item[0].length - 4)}
                                </td>
                                <td className="py-4 px-6 text-sm text-center font-medium text-gray-500 whitespace-nowrap dark:text-white">
                                  {ethers.utils.formatUnits(
                                    item[1]._hex,
                                    "gwei"
                                  )}{" "}
                                  ETH
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col  pd-5">
                  <h1 className="font-bold text-2xl text-gray-700 w-full text-center mb-5">
                    {" "}
                    Transaction history of Ladsdles NFT {id} #
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
                                Buyer
                              </th>
                              <th
                                scope="col"
                                className=" text-center py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                              >
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {data?.historyNFt?.sales.slice(0).reverse().map((item: any) => (
                              <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="py-4 px-6 text-sm text-center font-medium text-gray-500 whitespace-nowrap dark:text-white">
                                  {item.buyer.slice(0, 5) +
                                    "..." +
                                    item.buyer.substring(item.buyer.length - 4)}
                                </td>
                                <td className="py-4 px-6 text-sm text-center font-medium text-gray-500 whitespace-nowrap dark:text-white">
                                  {ethers.utils.formatUnits(
                                    item.price,
                                    "gwei"
                                  )}
                                   {" "}ETH
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
          );
        })}
      </main>
    </>
  );
};
