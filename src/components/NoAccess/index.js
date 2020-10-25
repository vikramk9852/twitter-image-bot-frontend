import React from 'react';
import { Modal, Button } from 'antd';
import {useHistory} from 'react-router-dom'
import './index.scss';
import "antd/dist/antd.css";

const NoAccess = ((props) => {
    const history = useHistory();
    return <div className="noaccess">
        <Modal
            visible={true}
            footer={false}
            closable={false}
            centered
        >
            <div align="center">
                <b><p className="ql-size-large" style={{ marginBottom: "0" }}>You must be logged in to view this page</p></b>
                <Button onClick={() => history.push('/login?state')}>Open Login Page</Button>
            </div>
        </Modal>
    </div>
})

export default NoAccess;