import React from 'react';
import './index.scss';
import { Spin } from 'antd';


const Loader = (() => (
    <div className="loader">
        <Spin size="large" />
    </div>
))

export default Loader;