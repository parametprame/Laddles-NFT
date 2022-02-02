import React from "react";
import { useWeb3React } from "@web3-react/core";
import { useContractContext } from "../context/contract";
import { injected } from "../utils/wallet/connector";

const Button = () => {
  const { activate, setError, chainId, error } = useWeb3React();
  const { isConnecting, setErrMsg, setIsConnecting } = useContractContext();

  async function connectMetaMask() {
    if (typeof window.ethereum !== "undefined") {
      if (!error) {
        setIsConnecting(true);
        try {
          await activate(injected);
          setIsConnecting(false);
          if (
            chainId &&
            chainId.toString() !== '4'
          ) {
            setErrMsg(
              `Change the network to Rinkeby.`
            );
          }
        } catch (error) {
          if (error instanceof Error) setError(error);
          setIsConnecting(false);
        }
      } else {
        setErrMsg(
          `Change the network to Rinkeby.`
        );
      }
    } else {
      setErrMsg("Please install MetaMask.");
    }
  }
  return (
    <>
      {isConnecting ? (
        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          Connected
        </button>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          onClick={connectMetaMask}
        >
          Connect Wallet
        </button>
      )}

    </>
  );
};

export default Button;
