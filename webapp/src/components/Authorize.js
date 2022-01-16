// SPDX-License-Identifier: BUSL-1.1
import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Form, Button, Card } from 'react-bootstrap'
import getContractAddress from '../util/getContractAddress'
import { ethers } from 'ethers'
import IERC20 from '../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json'

function Authorize(props) {
    const [assetId, setAsseId] = React.useState()

    const onOptIn = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const al = await getContractAddress('LendingAuction')
        const erc20Contract = new ethers.Contract(assetId, IERC20.abi, provider)
        const signer = provider.getSigner()
        const erc20ContractWithSigner = erc20Contract.connect(signer)
        const tx =  await erc20ContractWithSigner.approve(al, "1000000000000000000000")
        await tx.wait()
        window.alert("Confirmed"+tx.hash)
    }

    return (<>
        <Card border="primary" style={{ width: '18rem' }}>
            <Card.Header>Asset Opt-in</Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Asset ID</Form.Label>
                        <Form.Control type="string" onChange={e => setAsseId(e.target.value)} placeholder="49055308" />
                    </Form.Group>
                    <Button variant="primary" onClick={onOptIn}>
                        Authorize
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    </>);
}

export default Authorize;