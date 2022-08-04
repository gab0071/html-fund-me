import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constanst.js"
// all we need to interact with our smart contract in frontend

// PROVIDER / connection with the blockchain (infura, alquemy, etc)
// SIGNER / wallet / someone with some gas

// CONTRACT THAT WE ARE INTERCTING WITH

// ABI & ADDRESS
// ----- WITH ALL THIS TOGETHER WE CAN SEND ANY TRANSACCION -----

// connect function

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

// Connect wallet function
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}

// fund function
async function fund() {
    // This is the value of eth that we wanna to send
    const ethAmount = document.getElementById("ethAmount").value
    // all we need to interact with our smart contract in frontend

    // PROVIDER / connection with the blockchain (infura, alquemy, etc)
    // SIGNER / wallet / someone with some gas

    // CONTRACT THAT WE ARE INTERCTING WITH

    // ABI & ADDRESS
    // ----- WITH ALL THIS TOGETHER WE CAN SEND ANY TRANSACCION -----
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // we have to put this line here to see what happen with the tx
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Succesfully!!!")
        } catch (error) {
            console.log(error)
        }
    } else {
        withdrawButton.innerHTML = "Please install MetaMask"
    }
}

// get balance function
async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    } else {
        withdrawButton.innerHTML = "Please install MetaMask"
    }
}

// withdraw function
async function withdraw() {
    console.log(`Withdrawing...`)
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    } else {
        withdrawButton.innerHTML = "Please install MetaMask"
    }
}

// confirm the tx
// listen for the tx to be mined
function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}....`)
    // Listen for this tx to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })

    // this is a annonymus function () => {}
}
