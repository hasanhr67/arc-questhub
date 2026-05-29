"use client";

import { useState } from "react";

export default function Home() {

  const [completed, setCompleted] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ]);

  const quests = [
    "Say GM",
    "Say GN",
    "Deploy NFT",
    "Deploy Token",
    "Deploy Contract",
    "Mint NFT",
    "Join Arc"
  ];

  const done = completed.filter(Boolean).length;
  const progress = (done / quests.length) * 100;

  const toggleQuest = async (index:number) => {

  try {

    if (!(window as any).ethereum) {
      alert("Wallet not found");
      return;
    }

    const ARC_CHAIN_ID = "0x13b2";

    let chainId = await (window as any).ethereum.request({
      method: "eth_chainId"
    });

    if (chainId !== ARC_CHAIN_ID) {

      try {

        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ARC_CHAIN_ID }]
        });

      } catch (switchError:any) {

        if (switchError.code === 4902) {

          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0x13b2",
              chainName: "Arc Testnet",
              rpcUrls: ["https://rpc.testnet.arc.network"],
              nativeCurrency: {
                name: "USDC",
                symbol: "USDC",
                decimals: 6
              }
            }]
          });

        } else {

          throw switchError;

        }

      }

    }

    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts"
    });

    const tx = await (window as any).ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: accounts[0],
          to: accounts[0],
          value: "0x0"
        }
      ]
    });

    const updated = [...completed];
    updated[index] = true;

    setCompleted(updated);

    alert(
      `Quest Completed ✅\n\n${quests[index]}\n\nTX Hash:\n${tx}`
    );

  } catch(err) {

    console.log(err);

    alert("Transaction cancelled");

  }

};

  const claimNFT = async()=>{

  try{

    if (!(window as any).ethereum) {
      alert("Wallet not found");
      return;
    }

    const ARC_CHAIN_ID = "0x13b2";

    const chainId = await (window as any).ethereum.request({
      method: "eth_chainId"
    });

    if (chainId !== ARC_CHAIN_ID) {

      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARC_CHAIN_ID }]
      });

    }

    const accounts = await (window as any).ethereum.request({
      method:"eth_requestAccounts"
    });

    const tx = await (window as any).ethereum.request({
      method:"eth_sendTransaction",
      params:[
        {
          from:accounts[0],
          to:accounts[0],
          value:"0x0"
        }
      ]
    });

    alert(
      `NFT Reward Claimed 🎉\n\nTX Hash:\n${tx}`
    );

  }catch(err){

    console.log(err);

    alert("Transaction cancelled");

  }

};

  return (

    <main className="min-h-screen bg-black text-white p-8">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div>

          <h1 className="text-5xl font-bold text-sky-400">
            Arc QuestHub
          </h1>

          <p className="mt-3 text-gray-400">
            Builder-focused Web3 quest and reward platform
          </p>

        </div>

        {/* Faucet */}

        <div className="mt-6">

          <a
            href="https://faucet.circle.com/"
            target="_blank"
            rel="noopener noreferrer"
          >

            <button
              className="bg-sky-500 px-5 py-3 rounded-lg hover:bg-sky-600 font-semibold"
            >
              ARC Testnet Faucet 💧
            </button>

          </a>

        </div>

        {/* Progress */}

        <div className="mt-8 border border-gray-700 p-6 rounded-2xl">

          <h2 className="text-2xl font-semibold">
            Quest Progress
          </h2>

          <p className="mt-2">
            {done}/{quests.length} Completed
          </p>

          <div className="w-full bg-gray-800 rounded-full h-4 mt-4">

            <div
              className="bg-green-500 h-4 rounded-full"
              style={{
                width:`${progress}%`
              }}
            />

          </div>

        </div>

        {/* Quests */}

        <div className="mt-8 space-y-3">

          {quests.map((q,index)=>(

            <div
              key={index}
              className="border border-gray-700 rounded-xl p-4 flex justify-between"
            >

              <span>{q}</span>

              <button
                disabled={completed[index]}
                onClick={()=>toggleQuest(index)}
                className={`px-4 py-2 rounded ${
                  completed[index]
                  ? "bg-green-500"
                  : "bg-gray-700"
                }`}
              >

                {
                  completed[index]
                  ? "Done ✅"
                  : "Complete"
                }

              </button>

            </div>

          ))}

        </div>

        {/* Reward */}

        <div className="mt-8 border border-gray-700 p-6 rounded-2xl">

          <h2 className="text-xl font-bold">
            Reward Zone 🎁
          </h2>

          <p className="text-gray-400 mt-2">
            Complete all quests to unlock NFT reward
          </p>

          <button
            onClick={claimNFT}
            disabled={done!==quests.length}
            className={`mt-4 px-5 py-3 rounded-lg ${
              done===quests.length
              ? "bg-purple-600"
              : "bg-gray-700 cursor-not-allowed"
            }`}
          >

            {
              done===quests.length
              ? "Claim NFT Reward 🎉"
              : `Complete ${quests.length-done} more quests`
            }

          </button>

        </div>

      </div>

    </main>

  );

}
