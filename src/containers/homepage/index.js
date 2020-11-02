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
import BackendAPI from "../../utils/backend-api";

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            showLoader: false,
            pagesLeft: true,
            lastPage: 1,
            users: [],
            tweetUrls: []
        };
    }

    componentDidMount() {
        this.db = Firebase.getInstance().getDB();
        return this.fetchInitialData();
    }

    fetchInitialData = () => {
        return BackendAPI.getAllUsers().then((res) => {
            const users = res.data;
            this.setState({ users });
            this.fetchUser(users[0]);
        }).catch(err => {
            console.error(err);
            this.setState({ showLoader: false });
        })
    }

    fetchUser = (user) => {
        this.setState({ images: [], tweetUrls: [], lastPage: 1, showLoader: true }, () => {
            this.fetchData(user);
        });
    }

    fetchData = (user) => {
        let orderBy = "tweet_id", limit = 10;
        const { images, lastPage } = this.state;

        this.setState({ startIndex: Math.max(0, images.length - 1) });
        return BackendAPI.getUserData(user, lastPage, orderBy, limit).then(res => {
            let images = [], tweetUrls = [];
            const tweets = res.data;
            tweets.forEach((tweetObj) => {
                for (let imageIndex in tweetObj.tweet_media_url) {
                    images.push({
                        original: tweetObj.tweet_media_url[imageIndex],
                        thumbnail: tweetObj.tweet_media_url[imageIndex],
                        description: Utils.removeURLFromText(tweetObj.tweet_text)
                    })
                    tweetUrls.push(tweetObj.tweet_url)
                }
            })

            images = images.reverse();
            tweetUrls = tweetUrls.reverse();
            this.setState({
                images: this.state.images.concat(images.reverse()),
                tweetUrls: this.state.tweetUrls.concat(tweetUrls.reverse()),
                user,
                lastPage: lastPage + 1,
                pagesLeft: tweets.length === 10
            });
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            this.setState({ showLoader: false });
        })
    };

    fetchPrevDay = () => {
        if (this.state.pagesLeft)
            this.fetchData(this.state.user);
    }

    handleImageSlide = (imageIndex) => {
        if (imageIndex === this.state.images.length - 1) {
            this.fetchPrevDay();
        }
    }

    handleUserChange = (e) => {
        this.fetchUser(this.state.users[e.key]);
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
            <Menu onClick={this.handleUserChange}>
                {
                    this.state.users.map((user, index) => {
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
