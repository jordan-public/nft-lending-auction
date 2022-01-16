// SPDX-License-Identifier: BUSL-1.1
import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Form, Button, Card } from 'react-bootstrap'
import LendingAuction from '../artifacts/contracts/LendingAuction.sol/LendingAuction.json'
import getContractAddress from '../util/getContractAddress'
import { ethers } from 'ethers'

function CreateAuction(props) {
    const DENOMINATOR = 10000
    const [nftAddress, setNFTAddress] = React.useState("0x686f84e40319596d924cF4C56aCB5CB1b72816B6")
    const [nftId, setNFTId] = React.useState(0)
    const [currency, setCurrency] = React.useState("0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1")
    const [loanAmount, setLoanAmount] = React.useState(0.0)
    const [maxRepayAmount, setMaxRepayAmount] = React.useState(0.0)
    const [depositAmount, setDepositAmount] = React.useState(0.0)
    const [decrFactor, setdecrFactor] = React.useState(0.9)
    const [auctionDuration, setAuctionDuration] = React.useState(10)
    const [repayDuration, setRepayDuration] = React.useState(50)

    const onCreateAuction = async () => { 
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const al = await getContractAddress('LendingAuction')
        const lendingAuctionContract = new ethers.Contract(al, LendingAuction.abi, provider)
        const signer = provider.getSigner()
        const lendingAuctionContractWithSigner = lendingAuctionContract.connect(signer)
        const tx =  await lendingAuctionContractWithSigner.startAuction(
            nftAddress, nftId,
            currency,
            ethers.utils.parseEther(loanAmount.toString()),
            ethers.utils.parseEther(maxRepayAmount.toString()),
            ethers.utils.parseEther(depositAmount.toString()),
            Math.floor(decrFactor * DENOMINATOR),
            Math.floor(auctionDuration + (new Date().getTime() / 1000)),
            Math.floor(repayDuration + (new Date().getTime() / 1000)),    
        )
        await tx.wait()
        window.alert("Confirmed"+tx.hash)
    }

    return (<>
        <Card border="primary" style={{ width: '18rem' }}>
            <Card.Header>Create Auction:</Card.Header>
            <Card.Body>
                <Form>
                <Form.Group className="mb-3">
                        <Form.Label>NFT Address</Form.Label>
                        <Form.Control type="string" onChange={e => setNFTAddress(e.target.value)} placeholder="0x686f84e40319596d924cF4C56aCB5CB1b72816B6" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>NFT ID</Form.Label>
                        <Form.Control type="number" onChange={e => setNFTId(parseInt(e.target.value))} placeholder="0" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Currency (ERC20)</Form.Label>
                        <Form.Control type="string" onChange={e => setCurrency(e.target.value)} placeholder="0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Loan amount</Form.Label>
                        <Form.Control type="number" onChange={e => setLoanAmount(parseFloat(e.target.value))} placeholder="100.0" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Deposit amount</Form.Label>
                        <Form.Control type="number" onChange={e => setDepositAmount(parseFloat(e.target.value))} placeholder="10.0" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Max repay amount</Form.Label>
                        <Form.Control type="number" onChange={e => setMaxRepayAmount(parseFloat(e.target.value))} placeholder="120.0" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Min repay decrease factor</Form.Label>
                        <Form.Control type="number" onChange={e => setdecrFactor(parseFloat(e.target.value))} placeholder="0.9" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Auction Duration (seconds)</Form.Label>
                        <Form.Control type="number" onChange={e => setAuctionDuration(parseInt(e.target.value))} placeholder="10" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Repayment Duration (seconds)</Form.Label>
                        <Form.Control type="number" onChange={e => setRepayDuration(parseInt(e.target.value))} placeholder="50" />
                    </Form.Group>

                    <Button variant="primary" onClick={onCreateAuction}>
                        Create auction
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    </>);
}

export default CreateAuction;