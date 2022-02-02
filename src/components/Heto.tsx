import React from "react";
import ClosingAlert from "./Alert";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import ABI from "../contract/abi.json";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";
import classNames from "classnames";
import { useContractContext } from "../context/contract";
import styles from "../App.module.css";

export const Hero = () => {
  const { message, errMsg, setMessage } = useContractContext();
  const { chainId, account, active, library } = useWeb3React();
  const [isPending, setIsPending] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [supplyBar, setSupplyBar] = useState(0);
  const [mintAmount, setMintAmount] = useState(1);

  function decrementMintAmount() {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  }

  function incrementMintAmount() {
    if (mintAmount < 10) {
      setMintAmount(mintAmount + 1);
    }
  }

  async function claimNFTs() {
    if (active && account && !errMsg) {
      const totalCostWei =  totalSupply < 10 ? 0 : (20000000000000000 * mintAmount).toString();
      const totalGasLimit = (285000 * mintAmount).toString();
      setMessage("");
      setIsPending(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          "0xa632D4028fb12c4D53c5cEDa08188b949427Da6f",
          ABI,
          signer
        );
        const transaction = await contract.mint(mintAmount, {
          value: totalCostWei,
          gasLimit: totalGasLimit.toString(),
        });
        setIsPending(false);
        setIsMinting(true);
        await transaction.wait();
        setIsMinting(false);
        setMessage(
          `Yay! ${1} ${
            process.env.REACT_APP_NFT_SYMBOL
          } successfully sent to ${account.substring(
            0,
            6
          )}...${account.substring(account.length - 4)}`
        );
      } catch (error) {
        setIsPending(false);
        setIsMinting(false);
      }
    }
  }


  useEffect(() => {
    async function fetchTotalSupply() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xa632D4028fb12c4D53c5cEDa08188b949427Da6f",
        ABI,
        provider
      );
      const totalSupply = await contract.totalSupply();
      setSupplyBar((totalSupply / 5000) * 100);
      setTotalSupply(totalSupply.toString());
    }

    const intervalId = setInterval(() => {
      fetchTotalSupply()
    }, 500) // in milliseconds
    return () => clearInterval(intervalId)
    
  }, [active, chainId, totalSupply]);

  const notify = toast.custom(
    (t) => (
      <div
        className={classNames([
          styles.notificationWrapper,
          t.visible ? "top-0" : "-top-96",
        ])}
      >
        <div className={styles.contentWrapper}>
          <h1>Change the network to Rinkeby.</h1>
        </div>
        <div className={styles.closeIcon} onClick={() => toast.dismiss(t.id)}>
          <MdOutlineClose />
        </div>
      </div>
    ),
    { id: "unique-notification", position: "top-center" }
  );

  return (
    <>
      <section className="relative  w-full h-full bg-black">
        {errMsg ? (
          <>
            {" "}
            {notify} <Toaster />{" "}
          </>
        ) : null}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="text-white py-10 text-center">
              <p className="tracking-widest">
                {" "}
                Powered by
                <span className="text-blue-600/100 text-2xl tracking-widest">
                  {" "}
                  Inwdroid{" "}
                </span>{" "}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="text-white  text-center">
              <p className="tracking-widest xl:text-7xl lg:text-5xl md:text-2xl	 sm:text-2xl font-bold animate-bounce">
                Exclusive
              </p>
              <p className="tracking-widest xl:text-7xl lg:text-5xl md:text-2xl	 sm:text-2xl font-bold ">
                collectible NFTs
              </p>
            </div>
          </div>
          <div className="flex flex-wrap py-20">
            <div className="w-full md:w-6/12 lg:w-3/12 mb-6 px-6 sm:px-6 lg:px-4">
              <div className="flex flex-col">
                <img
                  className="rounded-2xl drop-shadow-md hover:drop-shadow-xl transition-all duration-200 delay-100 hover:animate-bounce"
                  src="https://siasky.net/AAC92tBEOlF8pA7Kkd4zTI_XsyyrrAMQMuJp4m225cKwtA"
                />
              </div>
            </div>

            <div className="w-full md:w-6/12 lg:w-3/12 mb-6 px-6 sm:px-6 lg:px-4">
              <div className="flex flex-col">
                <img
                  className="rounded-2xl drop-shadow-md hover:drop-shadow-xl transition-all duration-200 delay-100 hover:animate-bounce"
                  src="https://siasky.net/CAAwuISyjr8aZcYjnwwcXRnzmoapkeaRV4T5h4qFG8jG9g"
                />
              </div>
            </div>

            <div className="w-full md:w-6/12 lg:w-3/12 mb-6 px-6 sm:px-6 lg:px-4">
              <div className="flex flex-col">
                <img
                  className="rounded-2xl drop-shadow-md hover:drop-shadow-xl transition-all duration-200 delay-100 hover:animate-bounce"
                  src="https://siasky.net/CABBCsxqfzZLMbjYe7KYVlPAPiMyjI0wMTcPI8qjIZn4cQ"
                />
              </div>
            </div>

            <div className="w-full md:w-6/12 lg:w-3/12 mb-6 px-6 sm:px-6 lg:px-4">
              <div className="flex flex-col">
                <img
                  className="rounded-2xl drop-shadow-md hover:drop-shadow-xl transition-all duration-200 delay-100 hover:animate-bounce"
                  src="https://siasky.net/CABb6GDlJri6DF1FgYJfcAVLQ95nMRKKDdQwTC7LzbDY7g"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex pt-12 w-full h-screen sm:h-full bg-black ">
        <div className="container mx-auto px-4 my-10">
          <div className="items-center flex flex-wrap">
            <div className="w-full md:w-6/12 ml-auto mr-auto px-4">
              <img
                alt="..."
                className="max-w-full rounded-lg shadow-lg"
                src="https://siasky.net/PAE3dqLCCRJ611QqTfFOcFk5YsvPBC3ljGb6T3R99CJOfg"
              />
            </div>
            <div className="w-full md:w-6/12 ml-auto mr-auto px-4">
              <div className="md:pr-12">
                <h3 className="text-3xl text-white">Laddles</h3>
                <p className="mt-4 text-lg leading-relaxed text-blueGray-500 text-white">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <h3 className="text-3xl text-white text-center py-3">
                  Cost 0.02 ETH
                </h3>
                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className="bg-purple-400 h-6  text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                    style={{ width: `${supplyBar}%` }}
                  >
                    {totalSupply}
                  </div>
                </div>

                <div className="w-full md:w-6/12 ml-auto mr-auto px-4 mt-6">
                  <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                    <button
                      data-action="decrement"
                      className={
                        mintAmount === 1
                          ? "bg-gray-500 text-gray-600 h-full w-20 cursor-default"
                          : "bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-default outline-none"
                      }
                      onClick={decrementMintAmount}
                    >
                      <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <span className=" justify-center outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none">
                      {mintAmount}
                    </span>
                    <button
                      data-action="increment"
                      className={
                        mintAmount === 10
                          ? "bg-gray-500 text-gray-600 h-full w-20 cursor-default"
                          : "bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                      }
                      onClick={incrementMintAmount}
                    >
                      <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  {!active || errMsg ? (
                    <button
                      className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full "
                      onClick={claimNFTs}
                    >
                      Mint NFT
                    </button>
                  ) : (
                    <>
                      {isPending || isMinting ? (
                        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full disble">
                          <span
                            className="spinner-border spinner-border-sm mr-3"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {"  "}
                          {isPending && "Pending..."}
                          {isMinting && "Minting..."}
                          {!isPending && !isMinting && "Processing.."}
                        </button>
                      ) : (
                        <button
                          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full "
                          onClick={claimNFTs}
                        >
                          Mint NFT
                        </button>
                      )}
                    </>
                  )}
                  {message && <ClosingAlert />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex pt-12 w-full h-full sm:h-full bg-black">
        <div className="container mx-auto px-4 my-10">
          <div className="grid grid-cols-1 gap-4">
            <div className="text-white  text-center">
              <p className="tracking-widest xl:text-7xl lg:text-5xl md:text-2xl	 sm:text-2xl font-bold">
                FAQ
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-20">
            <div className="flex justify-center">
              <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
                <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
                  How much do they cost and what is the total supply?
                </h5>
                <p className="text-gray-700 text-base mb-4">
                  The total supply of Ladsdles is 9,999 with a mint cost of .08Ξ
                  per Lad.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
                <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
                  What are missions?
                </h5>
                <p className="text-gray-700 text-base mb-4">
                  Missions are the gamification mechanism for the Ladsdles
                  universe. With your crew(s), you will be able to complete
                  missions to mint/claim other Ladsdles NFT's and collections.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-20">
            <div className="flex justify-center">
              <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
                <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
                  Will I need more than one ape to run missions?
                </h5>
                <p className="text-gray-700 text-base mb-4">
                  Yes! For missions you will need a crew, but you can also have
                  multiple crews to run different missions simultaneously.
                  Depending on your crew mix, there will be significant
                  advantages over other crews.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
                <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
                  What is the best crew mix to have?
                </h5>
                <p className="text-gray-700 text-base mb-4">
                  The three crew types from most to least advantageous will be:
                  <li>3 Ladsdles total with 1 of each genus</li>
                  <li>3 Ladsdles total with any mix</li>
                  <li>2 Ladsdles total with any mix</li>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
