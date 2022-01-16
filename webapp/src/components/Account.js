// SPDX-License-Identifier: BUSL-1.1
import React from 'react'
import OnboardingButton from './OnboardingButton'
import Web3 from 'web3'
import { ethers } from 'ethers'

async function getChainName() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const network = await provider.getNetwork()
    return network.name + "(" + network.chainId + ")"
}

function Account() {
    const [account, setAccount] = React.useState(null);
    const [chainName, setChainName] = React.useState(null);

    React.useEffect(() => {
        if (!window.ethereum) return;     
        window.ethereum.on('accountsChanged', accounts => { setAccount(accounts[0]); window.location.reload(); });
        window.ethereum.on('chainChanged', async (chainId) => { setChainName(await getChainName()); window.location.reload(); });
        window.ethereum.on('connect', async (connectInfo) => { setChainName(await getChainName()) });
        window.ethereum.on('disconnect', (error) => { window.location.reload(); });
    }, []);

    React.useEffect(() => {
        if (window.ethereum && account === null) window.ethereum.request({ method: 'eth_accounts' }).then(a => {
            setAccount(a[0]);
        });
    
        if (window.ethereum && !window.web3.version) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
        }
    });

    if (account) return (<>Account: {account} Chain: {chainName}</>);
    else return(<OnboardingButton/>);
}

export default Account;