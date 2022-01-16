// SPDX-License-Identifier: BUSL-1.1
import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import {Table} from 'react-bootstrap'
import Asset from './Asset'
import AppItem from './AppItem'
import HouseNFT from '../artifacts/contracts/HouseNFT.sol/HouseNFT.json'
import LendingAuction from '../artifacts/contracts/LendingAuction.sol/LendingAuction.json'
import getContractAddress from '../util/getContractAddress'
import { ethers } from 'ethers'

function Balances(props) {
    const [numTokens, setNumTokens] = React.useState(0);
    const [numAuctions, setNumAuctions] = React.useState(0);

    React.useEffect(() => {
        (async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const a = await getContractAddress('HouseNFT')
            const al = await getContractAddress('LendingAuction')
            const houseNFTContract = new ethers.Contract(a, HouseNFT.abi, provider)
            const lendingAuctionContract = new ethers.Contract(al, LendingAuction.abi, provider)
            const h = await houseNFTContract.lastHouseId()
            const n = await lendingAuctionContract.numAuctions()
            setNumTokens(h.toNumber()) 
            setNumAuctions(n.toNumber())
        }) ()
    });

    return (<>
       <Table striped bordered hover>
            <thead>
                <tr>
                <th>Asset</th>
                <th>ID</th>
                <th>Balance</th>
                </tr>
            </thead>
            <tbody>
            {[...Array(numTokens).keys()].map(i => <Asset id={i} tokenId={i}></Asset>)}
            {[...Array(numAuctions).keys()].map(i => <AppItem id={i} aId={i}></AppItem>)}                
             </tbody>
        </Table>

     </>);
}

export default Balances;
