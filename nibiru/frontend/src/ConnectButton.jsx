import { useContext } from "react";
import { NibijsContext } from "./nibiJs/nibijsContext";
 
export default function ConnectButton () {
    const { nibiAddress, connectWallet, addNibiruToKeplr } = useContext(NibijsContext);
 
    return (
        <div>
        <div>
        <button className="button" onClick={addNibiruToKeplr}>
            Add Nibiru to Keplr
          </button>
          <hr/>
          <button className="button" onClick={connectWallet}>
            Connect Keplr
          </button>
        </div>
        <h2>
          {nibiAddress
            ? nibiAddress.slice(0, 9) + "...." + nibiAddress.slice(39, 43)
            : "Please connect wallet"}
        </h2>
      </div>
    )
}