// SPDX-License-Identifier: BUSL-1.1
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'

function AppItem(props) {
    return (
        <tr>
        <td>AUCTION
        </td>
        <td>{props.aId}</td>
        <td>APP
        </td>
        </tr>

    );
}

export default AppItem;