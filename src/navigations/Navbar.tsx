import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import Button from "../components/ButtonConnect";
import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useContractContext } from "../context/contract";
import { injected } from "../utils/wallet/connector";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { activate, setError, chainId, account, active } = useWeb3React();
  const { errMsg, setErrMsg } = useContractContext();


  useEffect(() => {
    async function loadInjectedWallet() {
      const isAuthorized = await injected.isAuthorized();
      if (isAuthorized) {
        await activate(injected);
      }
    }
    if (typeof window.ethereum !== "undefined") {
      try {
        loadInjectedWallet();
      } catch (error) {
        if (error instanceof Error) setError(error);
      }
    }
  }, [activate, setError]);

  useEffect(() => {
    if (active) {
      if (chainId && chainId.toString() !== "4") {
        setErrMsg(`Change the network to Rinkeby.`);
      } else {
        setErrMsg("");
      }
    } else {
      setErrMsg("");
    }
  }, [active, chainId, setErrMsg]);

  useEffect(() => {
    if (active) {
      if (chainId && chainId.toString() !== "4") {
        setErrMsg(`Change the network to Rinkeby`);
      } else {
        setErrMsg("");
      }
    } else {
      setErrMsg("");
    }
  }, [active, chainId, setErrMsg]);

  return (
    <div>
      <nav className="bg-black py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
               <a href="/"> <p className="font-mono text-[#FFFFFF] text-2xl"> Ladsdles </p> </a>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="/mynfts"
                    className=" hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My NFTs
                  </a>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="/marketplace"
                    className=" hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Marketplace
                  </a>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              {active && account && !errMsg ? (
                <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                  <span>
                    {`${account.substring(0, 6)}...${account.substring(
                      account.length - 4
                    )}`}
                  </span>
                </button>
              ) : errMsg ? (
                <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">
                  <span>Change the network to Rinkeby</span>
                </button>
              ) : (
                <Button />
              )}
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {(ref) => (
            <div className="md:hidden" id="mobile-menu">
              <div
                ref={ref}
                className="flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3 justify-center"
              >
                <a
                  href="/mynfts"
                  className="hover:bg-gray-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  My NFTs
                </a>
                {active && account && !errMsg ? (
                  <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                    <span>
                      {`${account.substring(0, 6)}...${account.substring(
                        account.length - 4
                      )}`}
                    </span>
                  </button>
                ) : errMsg ? (
                  <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">
                    <span>Change the network to Rinkeby</span>
                  </button>
                ) : (
                  <Button />
                )}
              </div>
            </div>
          )}
        </Transition>
      </nav>
    </div>
  );
};

export default Navbar;
