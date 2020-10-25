import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Select } from "antd"
import './index.scss';
import TwitterApi from '../../utils/twitter-api';
import { LoadingOutlined } from '@ant-design/icons';
import Loader from '../../components/Loader';
const { Option } = Select;

const AddTwitterHandle = () => {

    const AddTwitterHandleContent = () => {

        const [fetching, setFetching] = useState(false);
        const [noContentText, setNoContentText] = useState("Enter 3 or more characters to search");
        const [selectOptions, setSelectOptions] = useState([]);
        const [searchString, setSearchString] = useState("");
        const [selectedValue, setSelectedValue] = useState("");
        const [showLoader, setShowLoader] = useState(false);
        const [currentTimeoutId, setTimeoutId] = useState("");

        useEffect(() => {
            handleSearch(searchString);
        }, [searchString])

        const handleSearch = (value) => {
            if (value && value.length >= 3) {
                setFetching(true);
                setSelectOptions([]);
                if (currentTimeoutId) {
                    clearTimeout(currentTimeoutId);
                }
                const timeoutId = setTimeout(() => {
                    searchWithAPI(value)
                }, 500);
                setTimeoutId(timeoutId);
            }
            setNoContentText("Enter 3 or more characters to search");
        }

        const searchWithAPI = (value) => {
            console.log("count");
            return TwitterApi.searchUsers(value).then(res => {
                let fetchedData = res.data;
                let selectOptions = [];
                selectOptions = fetchedData.map((value, index) => (
                    <Option key={index} value={value.screen_name}>{value.name}</Option>
                ))

                setSelectOptions(selectOptions);
                if (!fetchedData.length) {
                    setNoContentText("No results found matching criteria");
                }

            }).catch(err => {
                console.error(err);
            }).finally(() => {
                setFetching(false);
            })
        }

        const addTwitterHandle = () => {
            const handle = selectedValue;
            setShowLoader(true);
            return TwitterApi.addtHandle(handle).then(res => {
                message.success(`${handle} added successfully to the database`);
                console.log(res);
            }).catch(err => {
                console.error("Error in adding handle", err);
                message.error("Error in adding handle");
            }).finally(() => {
                setShowLoader(false);
            })
        }

        return <div>
            <Modal
                visible={true}
                closable={false}
                title="Add a twitter handle"
                footer={<Button type="primary" onClick={addTwitterHandle}>Add</Button>}
            >
                {showLoader && <Loader />}
                <Select
                    className="add_tHandle__select"
                    onSearch={(value) => setSearchString(value)}
                    onSelect={(value) => setSelectedValue(value)}
                    notFoundContent={fetching ? <div>Searching...<LoadingOutlined /></div> : noContentText}
                    showSearch
                >
                    {selectOptions}
                </Select>
                <p className="no_margin">Enter some text in above input box</p>
                <p>A list of twitter handles will be fetched from twitter, matching the entered text</p>

            </Modal>
        </div>
    }


    return <AddTwitterHandleContent />
}

export default AddTwitterHandle;