// SPDX-License-Identifier: BUSL-1.1
import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import {Table} from 'react-bootstrap'
import Asset from './Asset'
import AppItem from './AppItem'
import HouseNFT from '../artifacts/contracts/HouseNFT.sol/HouseNFT.json'
import getContractAddress from '../util/getContractAddress'
import { ethers } from 'ethers'

function Balances(props) {
    const [numTOkens, setNumTokens] = React.useState(0);

    React.useEffect(() => {
        (async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const a = await getContractAddress('HouseNFT')
            const houseNFTContract = new ethers.Contract(a, HouseNFT.abi, provider)
            const h = await houseNFTContract.lastHouseId()
            setNumTokens(h.toNumber()) 
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
                {[...Array(numTOkens).keys()].map(i => <Asset id={i} tokenId={i}></Asset>)}
             </tbody>
        </Table>

     </>);
}

// Using: https://img.icons8.com/color/48/000000/cottage.png
// From: <a href="https://icons8.com/icon/11920/house">House icon by Icons8</a>

export default Balances;


/*
*/
//{props.accountInfo.assets.filter(asset => asset.amount>=0).map(asset => <Asset key={asset['asset-id']} asset={asset} algodClient={props.algodClient} wallet={props.wallet} account={props.account} accountInfo={props.accountInfo} refreshAccountInfo={props.refreshAccountInfo} />)}
//{props.accountInfo['created-apps'].filter(app => app.params['approval-program'].startsWith("")).map(app => <AppItem  key={app.id} app={app} algodClient={props.algodClient} wallet={props.wallet} account={props.account} accountInfo={props.accountInfo} refreshAccountInfo={props.refreshAccountInfo}/>)}
