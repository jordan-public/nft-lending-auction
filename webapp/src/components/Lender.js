// SPDX-License-Identifier: BUSL-1.1
import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import Authorize from './Authorize'
import AuctionInfo from './AuctionInfo'
import LendingAuction from '../artifacts/contracts/LendingAuction.sol/LendingAuction.json'
import getContractAddress from '../util/getContractAddress'
import { ethers } from 'ethers'

function Lender(props) {
    const [appID, setAppID] = React.useState(0)
    const [repaymentAmount, setRepymentAmount] = React.useState(0.0)
    const [refreshAuctionInfo, setRefreshAuctionInfo] = React.useState(0)
    const doRefreshAuctionInfo = () => { setRefreshAuctionInfo(Math.random()) }

    const onBid = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const al = await getContractAddress('LendingAuction')
        const lendingAuctionContract = new ethers.Contract(al, LendingAuction.abi, provider)
        const signer = provider.getSigner()
        const lendingAuctionContractWithSigner = lendingAuctionContract.connect(signer)
        const tx =  await lendingAuctionContractWithSigner.bid(
            appID,
            ethers.utils.parseEther(repaymentAmount.toString())
        )
        await tx.wait()
        window.alert("Confirmed"+tx.hash)
    }

    const onLiquidate = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const al = await getContractAddress('LendingAuction')
        const lendingAuctionContract = new ethers.Contract(al, LendingAuction.abi, provider)
        const signer = provider.getSigner()
        const lendingAuctionContractWithSigner = lendingAuctionContract.connect(signer)
        const tx =  await lendingAuctionContractWithSigner.liquidateLoan(
            appID,
        )
        await tx.wait()
        window.alert("Confirmed"+tx.hash)
    }

    return (<>
        <Container fluid="md">
            <Row>
                <Col>
                    <Authorize/>
                </Col>
                <Col>
                    <Card border="primary" style={{ width: '48rem' }}>
                        <Card.Header>Auction: {appID}</Card.Header>
                        <Card.Body>
                            <AuctionInfo auctionID={appID} algodClient={props.algodClient} refresh={refreshAuctionInfo} />

                            <Form>
                            <Form.Group className="mb-3">
                                    <Form.Label>Auction ID</Form.Label>
                                    <Form.Control type="number" onChange={e => setAppID(parseInt(e.target.value))} placeholder="49055308" />
                                </Form.Group>
                                <br/><br/>
                                <Form.Group className="mb-3">
                                    <Form.Label>Reayment amount</Form.Label>
                                    <Form.Control type="number" onChange={e => setRepymentAmount(parseFloat(e.target.value))} placeholder="120.0" />
                                </Form.Group>

                                <Button variant="primary" onClick={onBid}>
                                    Bid
                                </Button>
                                <br/><br/>
                                <Button variant="primary" onClick={onLiquidate}>
                                    Liquidate
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </>);
}

export default Lender;