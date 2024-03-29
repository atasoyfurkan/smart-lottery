import { BigNumber, utils } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction, useContractCall, useEthers } from "@usedapp/core"

import { useEffect, useState } from "react";
import { tlAddress, tlAbi, lotteryAbi, lotteryAddress } from "../Contracts/contracts.js"
import TextField from "@mui/material/TextField";
import ProgressButton from '../components/ProgressButton.js';
import Chip from "@mui/material/Chip";

const tlInterface = new utils.Interface(tlAbi)
const tlContract = new Contract(tlAddress, tlInterface)

const lotteryInterface = new utils.Interface(lotteryAbi)
const lotteryContract = new Contract(lotteryAddress, lotteryInterface)


function TicketBuyAndTransfer() {
    const { account } = useEthers();

    const { state: stateBuyTicket, send: sendBuyTicket } = useContractFunction(lotteryContract, 'buyTicket', {})
    const { state: stateTransfer, send: sendTransfer } = useContractFunction(lotteryContract, 'transferFrom', {})

    const { state: stateLotteryNo, send: sendLotteryNo } = useContractFunction(lotteryContract, 'getLotteryNo', {})
    const { state: stateLastOwnedTicketNo, send: sendLastOwnedTicketNo } = useContractFunction(lotteryContract, 'getLastOwnedTicketNo', {})

    useEffect(() => {
        const epochTimeInSeconds = Math.round(new Date().getTime() / 1000)
        sendLotteryNo(epochTimeInSeconds)
    }, [])

    useEffect(() => {
        if (stateLotteryNo && stateLotteryNo.transaction && stateLotteryNo.transaction.toNumber()) {
            sendLastOwnedTicketNo(stateLotteryNo.transaction.toNumber())
        }
    }, [stateLotteryNo, stateBuyTicket])

    const [randomNumber, setRandomNumber] = useState(0)
    const handleBuyTicket = async () => {
        const hashedRandomNumber = utils.solidityKeccak256(["uint256"], [randomNumber])

        await sendBuyTicket(hashedRandomNumber)
    }

    const [to, setTo] = useState("")
    const [tokenId, setTokenId] = useState(0)
    const handleTransfer = () => {
        sendTransfer(account, to, tokenId)
    }

    return (
        <div className='row justify-content-center align-items-center mt-5'>
            <div className='col-8'>
                <Chip className="mb-5 me-1" label={<span>Lottery No: <b>{stateLotteryNo && stateLotteryNo.transaction ? stateLotteryNo.transaction.toNumber() : "..."}</b></span>} variant="outlined" />
                <Chip className="mb-5" label={<span>Last Owned Ticket Id: <b>{stateLastOwnedTicketNo && stateLastOwnedTicketNo.transaction ? stateLastOwnedTicketNo.transaction[0].toNumber() : "..."}</b></span>} variant="outlined" />

                <div className='row justify-content-center align-items-center mb-5'>
                    <TextField className='mb-2' type="number" label="Random Number" value={randomNumber} onChange={e => setRandomNumber(e.target.value)} />
                    <ProgressButton onClick={handleBuyTicket} text="Buy Ticket" state={stateBuyTicket} />
                </div>
                <div className='row justify-content-center align-items-center mb-5'>
                    <TextField className='mb-2' label="To" value={to} onChange={e => setTo(e.target.value)} />
                    <TextField className='mb-2' type="number" label="Ticket Id" value={tokenId} onChange={e => setTokenId(e.target.value)} />
                    <ProgressButton onClick={handleTransfer} text="Transfer Ticket" state={stateTransfer} />
                </div>
            </div>
        </div>
    );
}

export default TicketBuyAndTransfer;