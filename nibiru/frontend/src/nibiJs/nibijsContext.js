import { createContext, useState } from "react";
import {
    NibiruTxClient,
    Testnet,
  } from "@nibiruchain/nibijs";

const NibijsContext = createContext(null);

const CHAIN_ID = "nibiru-testnet-1";

const NibijsContextProvider = ({ children }) => {
    const [nibijs, setNibijs] = useState(null);
    const [nibiAddress, setNibiAddress] = useState("");

    const chain = Testnet();

    async function setupKeplr(setNibijs, setNibiAddress) {
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        while (
            !window.keplr ||
            !window.getEnigmaUtils ||
            !window.getOfflineSignerOnlyAmino
        ) {
            await sleep(50);
        }

        await window.keplr.enable(CHAIN_ID);

        window.keplr.defaultOptions = {
            sign: {
                preferNoSetFee: false,
                disableBalanceCheck: true,
            },
        };

        const keplrOfflineSigner =
            window.getOfflineSignerOnlyAmino(CHAIN_ID);
        const accounts = await keplrOfflineSigner.getAccounts();

        const nibiAddress = accounts[0].address;

        const chain = Testnet();
        const txClient = await NibiruTxClient.connectWithSigner(chain.endptTm, keplrOfflineSigner)
        setNibijs(txClient)
        setNibiAddress(nibiAddress);
    }

    async function connectWallet() {
        try {
            if (!window.keplr) {
                console.log("intall keplr!");
            } else {
                await setupKeplr(setNibijs, setNibiAddress);
                localStorage.setItem("keplrAutoConnect", "true");
                console.log(nibiAddress);
            }
        } catch (error) {
            alert(
                "An error occurred while connecting to the wallet. Please try again."
            );
        }
    }

    function disconnectWallet() {
        setNibiAddress("");
        setNibijs(null);

        localStorage.setItem("keplrAutoConnect", "false");

        console.log("Wallet disconnected!");
    }

    async function addNibiruToKeplr () {
        const chainConfig = {
            rpc: "https://rpc.testnet-1.nibiru.fi",
            rest: "https://lcd.testnet-1.nibiru.fi",
            chainId: "nibiru-testnet-1",
            chainName: "nibiru-testnet-1",
            stakeCurrency: { coinDenom: "NIBI", coinMinimalDenom: "unibi", coinDecimals: 6 },
            bip44: {
                coinType: 118,
            },
            bech32Config: {
                bech32PrefixAccAddr: "nibi", bech32PrefixAccPub: "nibi" + "pub",
                bech32PrefixValAddr: "nibi" + "valoper",
                bech32PrefixValPub: "nibi" + "valoperpub",
                bech32PrefixConsAddr: "nibi" + "valcons",
                bech32PrefixConsPub: "nibi" + "valconspub"
            },
            currencies: [{ coinDenom: "NIBI", coinMinimalDenom: "unibi", coinGeckoId: "cosmos", coinDecimals: 6 }],
            feeCurrencies: [{ coinDenom: "NIBI", coinMinimalDenom: "unibi", coinGeckoId: "cosmos", coinDecimals: 6 }],
    
        }
        await window.keplr.experimentalSuggestChain(chainConfig);
    }

    return (
        <NibijsContext.Provider
            value={{
                nibijs,
                setNibijs,
                nibiAddress,
                setNibiAddress,
                connectWallet,
                disconnectWallet,
                addNibiruToKeplr
            }}
        >
            {children}
        </NibijsContext.Provider>
    );
};

export { NibijsContext, NibijsContextProvider };
