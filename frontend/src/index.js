import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Button } from "@material-tailwind/react";
import { NetworkErrorMessage } from "./utils/NetworkErrorMesage";
import Home from './pages/Home';
import Feed from './pages/Feed';
import { Buffer } from 'buffer';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import {reactLocalStorage} from 'reactjs-localstorage';

// @ts-ignore
window.Buffer = Buffer;
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/feed",
    element: <Feed/>,
  },
]);
const HARDHAT_NETWORK_ID = '1337';

const Header = () => {
  const [networkError, setNetworkError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const initialize = function (addr){
    reactLocalStorage.set('user', addr);
    setSelectedAddress(addr)
    console.log("init", selectedAddress)
  }
  const _connectWallet = async function() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(selectedAddress)
    // Once we have the address, we can initialize the application.

    setSelectedAddress(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
        //_stopPollingData();
        // `accountsChanged` event can be triggered with an undefined newAddress.
        // This happens when the user removes the Dapp from the "Connected
        // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
        // To avoid errors, we reset the dapp state
        if (newAddress === undefined) {
          return _resetState();
        }

        setSelectedAddress(newAddress);
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", ([networkId]) => {
        console.log("Chain changed")
      });
  }
  function _dismissNetworkError() {
    this.setNetworkError({ networkError: undefined });
  }
  // Fix This for goerli
  function _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    this.setState({
      networkError: 'Please connect Metamask to Localhost:8545'
    });
    return false;
  }
  function _resetState(){}
  function ConnectWallet({ connectWallet, networkError, dismiss }) {
    return (
      <div className="container">
        
          <div className="col-12 text-center">
            {networkError && (
              <NetworkErrorMessage
                message={networkError}
                dismiss={dismiss}
              />
            )}
          </div>
            <Button
              type="button"
              onClick={async() => { await connectWallet()}}
            >
              {selectedAddress == ""?"Connect Wallet":selectedAddress}
            </Button>
    
      </div>
    );
  }

  return (
    <nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
    <div class="container flex flex-wrap items-center justify-between mx-auto">
      <a href="/" class="flex items-center">
          <img src="logo.svg" class="h-20 lr-3 sm:h-110" alt="Flowbite Logo" />
      </a>
      <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
      </button>
      <div class="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <a href="/" style={{"font-size": 1.5+'em'}} class="block py-2 pl-3 pr-4 bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" aria-current="page">Home</a>
          </li>
          <li>
            <a href="/feed" style={{"font-size": 1.5+'em'}} class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Feed</a>
          </li>
          <li>
          <ConnectWallet connectWallet={async()=>{await _connectWallet()}}
                          networkError={networkError}
                          dismiss={() => _dismissNetworkError()}
          > </ConnectWallet>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header/>
     <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
