import { ethers } from "ethers";

import TokenArtifact from "../contracts/Token.json";
import SafePayArtifact from "../contracts/SafePay.json";
import contractAddress from "../contracts/contract-address.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const token = new ethers.Contract(
    contractAddress.Token,
    TokenArtifact.abi,
    provider.getSigner(0)
);

const safePay = new ethers.Contract(
    contractAddress.SafePay,
    SafePayArtifact.abi,
    provider.getSigner(0)
);

function getContract(){
    return {
        "token": token,
        "safePay": safePay
    }
}
export default getContract
