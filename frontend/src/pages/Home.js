import React, { useState, useRef } from "react";
import getContract from "../utils/GetContract";
import { Button } from "@material-tailwind/react";
import Alert from '@mui/material/Alert';


export default function Home(){
    const [payer, setPayer] = useState("");
    const [reciever, setReciever] = useState("");
    const [token, setToken] = useState("");
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState("");
    const [timePeriod, setTimePeriod] = useState(0);
    const [timeClass, setTimeClass] = useState("");
    const [id, setId] = useState("")
    const timeConversion = {
        "-": 1,
        "day": 86400,
        "month": 2628000,
        "year": 31556952
    }

    const createRequest = async () => {
        console.log(payer)
        if (
            payer === "" ||
            reciever === "" ||
            token === "" ||
            amount === "" ||
            message === ""
        ) {
            console.log("Please, all the fields are required!");
            return;
        }
        console.log("Create Reques")
        console.log("Amount - ", amount)
        let contract = getContract()["safePay"]
        let calcTimePeriod = timeConversion[timeClass]*timePeriod
        let tx = await contract.createRequest(
            payer,
            reciever,
            token,
            amount, 
            calcTimePeriod,
            message
        )
        let txr = await tx.wait()
        
        console.log("ID ", txr)
    };
    
   
    return (
        <div class="flex items-center justify-center h-screen">
        <form class="w-full max-w-lg">
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md:w-1/1 px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                    Payer
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" 
                value={payer} 
              onChange={(e) => setPayer(e.target.value)} placeholder="0x...."/>
                </div>

                <div class="w-full md:w-1/1 px-3">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                    Reciever
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" 
                value={reciever}
                onChange={(e) => setReciever(e.target.value)}/>
                </div>

                <div class="w-full md:w-1/1 px-3">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                    Token
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" 
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="0x...."/>
                </div>
            </div>

            <div class="flex flex-wrap -mx-3 mb-2">
                <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                    Amount
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10"/>
                </div>

                <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                    TimePeriod
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" 
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                placeholder="10"/>
                <div class="relative">
                    <select onChange={(e)=>setTimeClass(e.target.value)} class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                    <option>-</option>
                    <option>day</option>
                    <option>Month</option>
                    <option>Year</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
                </div>
                <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                    Message
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A message Describing Request"/>
                </div>
                <div>
                    <Button variant="filled" onClick={async (e) => {
                        e.preventDefault();
                        await createRequest();
                    }}>Submit</Button>
                </div>
            </div>
            </form>
            </div>
    )
}