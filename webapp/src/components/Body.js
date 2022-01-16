// SPDX-License-Identifier: BUSL-1.1
import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Accordion, Tabs, Tab } from 'react-bootstrap'
import Balances from './Balances'
import Borrower from './Borrower'
import Lender from './Lender'

function Body(props) {
    const [activeTab, setActiveTab] = React.useState("list");
    const [loanRoot, setLoanRoot] = React.useState("");
    
    const onSelect = (key) => {
        setActiveTab(key);
    }

    //!!!if (!accountInfo) return("Please connect.")
    return (<>
        <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
            <Accordion.Header>Balances</Accordion.Header>
            <Accordion.Body>
                <Balances/>
            </Accordion.Body>
        </Accordion.Item>
        </Accordion> 

        <br/><br/><br/>

        </>);
}

export default Body;

/* 
        <Tabs activeKey={activeTab} transition={false} id="noanim-tab-example" onSelect={onSelect}>
            <Tab eventKey="list" title="Borrower">
                <Borrower setActiveTab={setActiveTab} setAgrRoot={setLoanRoot}/>
            </Tab>
            <Tab eventKey="agr" title="Lender">
                <Lender agrRoot={loanRoot} />
            </Tab>
        </Tabs>
*/