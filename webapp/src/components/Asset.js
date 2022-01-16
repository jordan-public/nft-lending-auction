// SPDX-License-Identifier: BUSL-1.1
import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Button } from 'react-bootstrap'
import HouseNFT from '../artifacts/contracts/HouseNFT.sol/HouseNFT.json'
import LendingAuction from '../artifacts/contracts/LendingAuction.sol/LendingAuction.json'
import getContractAddress from '../util/getContractAddress'
import { ethers } from 'ethers'

function Asset(props) {
    const [assetURI, setAssetURI] = React.useState()
    const [assetHolding, setAssetHolding] = React.useState(0)

    React.useEffect(() => {
        (async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const a = await getContractAddress('HouseNFT')
            const houseNFTContract = new ethers.Contract(a, HouseNFT.abi, provider)
            const uri = await houseNFTContract.tokenURI(props.tokenId)
            const account =(await provider.listAccounts())[0]
            const holding = await houseNFTContract.balanceOf(account)
            setAssetURI(uri)
            setAssetHolding(holding.toNumber())
        }) ()
    }, [props.tokenId]);

    const onAuthorize = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const a = await getContractAddress('HouseNFT')
        const al = await getContractAddress('LendingAuction')
        const houseNFTContract = new ethers.Contract(a, HouseNFT.abi, provider)
        const signer = provider.getSigner()
        const houseNFTContractWithSigner = houseNFTContract.connect(signer)
        const tx =  await houseNFTContractWithSigner.approve(al, props.tokenId)
        await tx.wait()
        window.alert("Confirmed"+tx.hash)
    }

    if (!assetURI) return(<></>);
    return (
        <tr>
        <td>{assetURI}
        </td>
        <td>{props.tokenId}</td>
        <td>{assetHolding}
            {" "}<Button onClick={onAuthorize}>Authorize</Button>
        </td>
        </tr>

    );
}

export default Asset;