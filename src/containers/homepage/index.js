import React from "react";
import "./index.scss";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import { Dropdown, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import Firebase from '../../utils/firebase';
import Loader from "../../components/Loader";
import Utils from '../../utils/utils';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            showLoader: false,
            pagesLeft: true,
            tHandles: [],
            tweetUrls: []
        };
    }

    componentDidMount() {
        this.db = Firebase.getInstance().getDB();
        return this.fetchInitialData();
    }

    fetchInitialData = () => {
        let tHandles = [];
        const dataPath = "tHandles";
        return this.db.getData(dataPath).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                tHandles.push(doc.id)
            });
            this.setState({ tHandles });
            this.fetchUser(tHandles[0]);
        }).catch(err => {
            console.error(err);
            this.setState({ showLoader: false });
        })
    }

    fetchUser = (tHandle) => {
        this.setState({ images: [], tweetUrls: [], showLoader: true }, () => {
            this.fetchData(tHandle, true);
        });
    }

    fetchData = (tHandle, start) => {
        let dataPath = `tHandles/${tHandle}/images/`;
        let orderBy = { "field": "tweet_id", "order": "desc" }, limit = 10, startAfter;
        if (!start) {
            startAfter = this.state.lastVisible;
        }

        this.setState({ startIndex: Math.max(0, this.state.images.length - 1) });
        return this.db.getData(dataPath, orderBy, startAfter, limit).then(res => {
            let imageObj, images = [], tweetUrls = [];
            res.forEach((tweetObj) => {
                imageObj = tweetObj.data();
                for (let imageIndex in imageObj.tweet_media_url) {
                    images.push({
                        original: imageObj.tweet_media_url[imageIndex],
                        thumbnail: imageObj.tweet_media_url[imageIndex],
                        description: Utils.removeURLFromText(imageObj.tweet_text)
                    })
                    tweetUrls.push(imageObj.tweet_url)
                }
            })

            images = images.reverse();
            tweetUrls = tweetUrls.reverse();
            this.setState({
                images: this.state.images.concat(images.reverse()),
                tweetUrls: this.state.tweetUrls.concat(tweetUrls.reverse()),
                tHandle,
                lastVisible: res.docs[res.docs.length - 1],
                pagesLeft: res.docs.length === 10
            });
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            this.setState({ showLoader: false });
        })
    };

    fetchPrevDay = () => {
        if (this.state.pagesLeft)
            this.fetchData(this.state.tHandle);
    }

    handleImageSlide = (imageIndex) => {
        if (imageIndex === this.state.images.length - 1) {
            this.fetchPrevDay();
        }
    }

    handleTwitterHandleChange = (e) => {
        this.fetchUser(this.state.tHandles[e.key]);
    }

    handleOnClick = (e) => {
        let clickTime = + new Date();
        let { prevClickTime } = this.state;

        this.setState({ prevClickTime: clickTime });
        if (clickTime - prevClickTime < 500) {
            var currentIndex = this._imageGallery.getCurrentIndex();
            let urls = this.state.tweetUrls[currentIndex].split(' ');
            let tweetUrl = urls[urls.length - 1];
            window.open(tweetUrl, "_blank")
        }
    }

    render() {
        const { images, startIndex, showLoader } = this.state;
        const menu = (
            <Menu onClick={this.handleTwitterHandleChange}>
                {
                    this.state.tHandles.map((user, index) => {
                        return <Menu.Item key={index}>{user}</Menu.Item>
                    })
                }
            </Menu>
        )
        return (
            <div className="homepage">
                {showLoader ?
                    <Loader />
                    :
                    <ImageGallery
                        ref={i => this._imageGallery = i}
                        showNav={false}
                        showIndex={true}
                        items={images}
                        startIndex={startIndex}
                        disableThumbnailScroll={false}
                        onSlide={this.handleImageSlide}
                        infinite={false}
                        onClick={this.handleOnClick}
                    />
                }
                <Dropdown className="handle-select" overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <MenuOutlined />
                    </a>
                </Dropdown>
            </div>
        );
    }
}
