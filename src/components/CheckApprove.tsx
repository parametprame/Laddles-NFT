import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import ABI from "../contract/abi.json";
import MARKET_ABI from "../contract/abi_market.json";
import { useContractContext } from "../context/contract";

const CheckApprove = (props: any) => {
  const [approveid, setApproveId] = useState({
    tokenId: "",
    addressApprove: "",
  });
  const { tokenId, price } = props;
  const { chainId, account, active, library } = useWeb3React();
  const [isPending, setIsPending] = useState(false);
  const { message, errMsg, setMessage } = useContractContext();
  const address = "0xd76978ba8518D70f73A74e43Ec2e5bb4483DCc7b";
  const addressNFT = "0xb078b1271d5b118aeffd2390d16183eb47d416fc";

  useEffect(() => {
    async function getApprove() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xb078b1271d5b118aeffd2390d16183eb47d416fc",
        ABI,
        provider
      );
      const addressApprove = await contract.getApproved(tokenId);
      setApproveId({
        tokenId: tokenId,
        addressApprove: addressApprove === address ? "true" : "false",
      });
    }
    getApprove();
  }, []);

  async function ApproveNFT(e: any) {
    e.preventDefault();
    if (active && account && !errMsg) {
      setIsPending(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          "0xb078b1271d5b118aeffd2390d16183eb47d416fc",
          ABI,
          signer
        );
        const transaction = await contract.approve(address, tokenId);
        await transaction.wait();
        setIsPending(false);
        window.location.reload();
      } catch (err) {
        setIsPending(false);
      }
    }
  }

  async function SellNFT(e: any) {
    e.preventDefault();
    if (active && account && !errMsg) {
      setIsPending(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          "0xd76978ba8518D70f73A74e43Ec2e5bb4483DCc7b",
          MARKET_ABI,
          signer
        );
        const transaction = await contract.listToken(
          addressNFT,
          tokenId,
          price * 10 ** 9
        );
        await transaction.wait();
        setIsPending(false);
        window.location.replace("/mynfts");
      } catch (err) {
        console.log(err)
        setIsPending(false);
      }
    }
  }

  return (
    <>
      {approveid.addressApprove === "true" ? (
        <>
          {isPending ? (
            <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded w-full">
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
              onClick={SellNFT}
            >
              Sell
            </button>
          )}
        </>
      ) : (
        <>
          {isPending ? (
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full disble">
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
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full"
              onClick={ApproveNFT}
            >
              Approve
            </button>
          )}
        </>
      )}
    </>
  );
};

export default CheckApprove;