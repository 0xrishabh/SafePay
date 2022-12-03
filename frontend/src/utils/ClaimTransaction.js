import getContract from "../utils/GetContract"
const safePay = getContract()["safePay"]
export async function claim(id){
    let tx = await safePay.claim(id);
    let tx_reciept = await tx.wait()
}