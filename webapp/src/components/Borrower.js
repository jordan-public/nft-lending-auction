// SPDX-License-Identifier: BUSL-1.1
import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import AuctionInfo from './AuctionInfo'
import CreateAuction from './CreateAuction'
import LendingAuction from '../artifacts/contracts/LendingAuction.sol/LendingAuction.json'
import getContractAddress from '../util/getContractAddress'
import { ethers } from 'ethers'

function Borrower(props) {
    const [appID, setAppID] = React.useState(0)
    const [refreshAuctionInfo, setRefreshAuctionInfo] = React.useState(0)
    const doRefreshAuctionInfo = () => { setRefreshAuctionInfo(Math.random()) }

    const onCancelAuction = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const al = await getContractAddress('LendingAuction')
        const lendingAuctionContract = new ethers.Contract(al, LendingAuction.abi, provider)
        const signer = provider.getSigner()
        const lendingAuctionContractWithSigner = lendingAuctionContract.connect(signer)
        const tx =  await lendingAuctionContractWithSigner.cancelAuction(
            appID,
        )
        await tx.wait()
        window.alert("Confirmed"+tx.hash)
    }

    const onBorrow = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const al = await getContractAddress('LendingAuction')
        const lendingAuctionContract = new ethers.Contract(al, LendingAuction.abi, provider)
        const signer = provider.getSigner()
        const lendingAuctionContractWithSigner = lendingAuctionContract.connect(signer)
        const tx =  await lendingAuctionContractWithSigner.getLoan(
            appID,
        )
        await tx.wait()
        window.alert("Confirmed"+tx.hash)
    }

    const onRepay = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const al = await getContractAddress('LendingAuction')
        const lendingAuctionContract = new ethers.Contract(al, LendingAuction.abi, provider)
        const signer = provider.getSigner()
        const lendingAuctionContractWithSigner = lendingAuctionContract.connect(signer)
        const tx =  await lendingAuctionContractWithSigner.repayLoan(
            appID,
        )
        await tx.wait()
        window.alert("Confirmed"+tx.hash)
    }

    return (<>
        <Container fluid="md">
            <Row>
                <Col>
                    <CreateAuction {...props} />
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
                                <Button variant="primary" onClick={onBorrow}>
                                    Borrow
                                </Button>
                                <br/><br/>
                                <Button variant="primary" onClick={onRepay}>
                                    Repay
                                </Button>
                                <br/><br/>
                                <Button variant="primary" onClick={onCancelAuction}>
                                    Cancel Auction
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </>);
}

export default Borrower;