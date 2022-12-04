import {React, useState, useEffect}  from "react";
import getContract from "../utils/GetContract"
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import { Routes, Route, useParams } from 'react-router-dom';
import {approve} from "../utils/ApporveTransaction";
import {claim} from "../utils/ClaimTransaction";
import {reactLocalStorage} from 'reactjs-localstorage';

let safePay = getContract()["safePay"]


const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function Feed({user}){
    const {addr} = useParams();
    const [value, setValue] = useState(0);
    const [feed, setFeed] = useState([]);
    const [hidden, setHidden] = useState(0);
    const [query, setQuery] = useState("");


    const getFeed = async function(user){
        let ids = await safePay.getPaymentsId(user);
        console.log(ids)
        let paymentRequests = [];
        for(let id of ids){
            let paymenRequest = await safePay.getPayments(id)
            let {payer, reciever,token, amount, timePeriod, message} = paymenRequest
            paymentRequests.push({
                id: id,
                payer: payer, 
                reciever: reciever, 
                token: token,
                amount: amount,
                timePeriod: timePeriod,
                message: message
            })
        }
        console.log(paymentRequests)
        setFeed(paymentRequests)
    }
    //useEffect(()=>{
    //    getFeed(addr).then(()=>{})
    //}, [])
    return (
        <>
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input type="search" 
        id="default-search"
        class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        placeholder="Search Mockups, Logos..." 
        onChange={(e)=>setQuery(e.target.value)}
        required/>
        <button
            class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
            onClick={async ()=> {
                await getFeed(query);
            }}> 
                Search 
        </button>
    </div>

<div class="mb-4 border-b border-gray-200 dark:border-gray-700">
    <ul class="flex flex-wrap -mb-px text-sm font-medium text-justify" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
        <li class="mr-2" role="presentation">
            <button class="inline-block p-4 rounded-t-lg border-2" id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false" onClick={()=>{setHidden(0)}}>Payment Request Recieved</button>
        </li>
        <li class="mr-2" role="presentation">
            <button class="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false" onClick={()=>{setHidden(1)}}>Payment Request Sent</button>
        </li>
    </ul>
</div>
<div id="myTabContent">
    {hidden==0 && <div class=" p-4 bg-gray-50 rounded-lg dark:bg-gray-800" id="profile" role="tabpanel" aria-labelledby="profile-tab">
    {
            feed.filter((x)=>{
                return x.payer.toLowerCase() == query.toLowerCase()
            }).map(function(payment) {
                return (
                    <li key={payment.id} >
                        <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography>
                            Reciever: {payment.reciever}
                            </Typography>
                            <Typography>
                            Token: {payment.token}
                            </Typography>
                            <Typography>
                            Amount: {payment.amount.toString()}
                            </Typography>
                            <Typography>
                            TimePeriod: {payment.timePeriod.toString()}
                            </Typography>
                            <Typography>
                            Message: {payment.message}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={async() => {console.log(payment.id);await approve(payment.id)}}>Approve</Button>
                        </CardActions>
                        </Card>
                    </li>
                )
            })
        }
    </div>}
    { hidden==1 && 
        <div class=" p-4 bg-gray-50 rounded-lg dark:bg-gray-800" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
            {feed.filter((x)=>{
                return x.reciever.toLowerCase() == query.toLowerCase()
            }).map(function(payment) {
                return (
                    <li key={payment.id} >
                        <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography>
                            Payer: {payment.payer}
                            </Typography>
                            <Typography>
                            Token: {payment.token}
                            </Typography>
                            <Typography>
                            Amount: {payment.amount.toString()}
                            </Typography>
                            <Typography>
                            TimePeriod: {payment.timePeriod.toString()}
                            </Typography>
                            <Typography>
                            Message: {payment.message}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={async() => {await claim(payment.id)}}>Claim</Button>
                        </CardActions>
                        </Card>
                    </li>)})}
        </div>
    }
</div>
    </>
    )
}

