import Safe from '@safe-global/safe-core-sdk'
import { OperationType, SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import SafeServiceClient from '@safe-global/safe-service-client'
import { ethers } from 'ethers'
import SafePayArtifact from "../contracts/SafePay.json";
// This file can be used to play around with the Safe Core SDK



export async function approve(id) {
    if(id == ""){
        console.log("return")
        return 
    }
    const config = {
        SAFE_ADDRESS: '0x5992d889d8955B18fb71D0fE2C4A1f9C4BeE4a2a',
        TX_SERVICE_URL: 'https://safe-transaction-goerli.safe.global/' // Check https://docs.safe.global/backend/available-services
      }
      
      
      let iface = new ethers.utils.Interface(SafePayArtifact.abi);
      let calldata = iface.encodeFunctionData("acceptRequest", [id])

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = await provider.getSigner()

  // Create EthAdapter instance
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer
  })

  // Create Safe instance
  const safe = await Safe.create({
    ethAdapter,
    safeAddress: config.SAFE_ADDRESS
  })

  // Create Safe Service Client instance
  const service = new SafeServiceClient({
    txServiceUrl: config.TX_SERVICE_URL,
    ethAdapter
  })

  // Create transaction
  const safeTransactionData = {
    to: "0x4577A292ceE8f3B32853A1E16a425EcA2aF388dd",
    value: '0', // 1 wei
    data: calldata,
    operation: OperationType.Call
  }
  const safeTransaction = await safe.createTransaction({ safeTransactionData })

  const senderAddress = await signer.getAddress()
  const safeTxHash = await safe.getTransactionHash(safeTransaction)
  const signature = await safe.signTransactionHash(safeTxHash)

  // Propose transaction to the service
  await service.proposeTransaction({
    safeAddress: config.SAFE_ADDRESS,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress,
    senderSignature: signature.data
  })

  console.log('Proposed a transaction with Safe:', config.SAFE_ADDRESS)
  console.log('- safeTxHash:', safeTxHash)
  console.log('- Sender:', senderAddress)
  console.log('- Sender signature:', signature.data)
}
