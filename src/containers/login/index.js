import React, { Component } from 'react';
import { Input, Button, Form, Checkbox, message } from 'antd';
import Loader from '../../components/Loader';
import Firebase from '../../utils/firebase';
import {
    UserOutlined,
    LockOutlined,
} from '@ant-design/icons';
import './index.scss';
import "antd/dist/antd.css";

const loginText = "Login using your registered email and password";
const resetText = "Enter your registered email to reset password";
const resetLinkText = "A reset link has been sent to your registered email id, use that link to reset your password";

class Login extends Component {

    constructor(props) {
        super(props);
        this.initState = {
            showLoader: false,
            resetPassword: false,
            resetLinkSent: false,
            toGoBack: false
        }
        this.state = this.initState
    }

    componentDidMount() {
        let firebase = Firebase.getInstance();
        let user = firebase.getAuth().getCurrentUser();
        if (user) {
            this.props.history.goBack();
        }
        let path = this.props.history.location.search;
        if (path.includes('state')) {
            this.setState({ toGoBack: true });
        }
    }

    handleSubmit = (values) => {
        console.log(values)
        this.setState({ showLoader: true }, () => {
            let firebase = Firebase.getInstance();
            if (this.state.resetPassword) {
                firebase.getAuth().resetPassword(values.email).then(res => {
                    this.setState({ showLoader: false, resetLinkSent: true });
                }).catch(err => {
                    message.error(err.message);
                    this.setState({ showLoader: false });
                })
            }
            else {
                firebase.getAuth().logIn(values.email, values.password).then(res => {
                    message.success("Successfully logged in");
                    this.setState({ showLoader: false });
                    if (this.state.toGoBack) {
                        this.props.history.goBack();
                    }
                    this.props.history.push('/admin');
                }).catch(err => {
                    message.error(err.message);
                    this.setState({ showLoader: false });
                })
            }
        })
    };

    render() {
        return (
            <div>
                {
                    this.state.showLoader ?
                        <Loader />
                        :
                        this.state.resetLinkSent ?
                            <div className="login__form">
                                <p>{resetLinkText}</p>
                                <a onClick={() => this.setState(this.initState)}>Go back to Login page</a>
                            </div>
                            :
                            <div className="login__form">
                                <h3 className="login__form__heading">{this.state.resetPassword ? resetText : loginText}</h3>
                                <Form onFinish={this.handleSubmit}>
                                    <Form.Item
                                        style={{ marginBottom: "1em" }}
                                        name="email"
                                        rules={[{ required: true, message: 'Please input your email!' }]}

                                    >
                                        <Input
                                            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Username"
                                        />
                                    </Form.Item>
                                    {
                                        !this.state.resetPassword ?
                                            <div>
                                                <Form.Item
                                                    name="password"
                                                    rules={[{ required: true, message: 'Please input your Password!' }]}
                                                >
                                                    <Input
                                                        prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                        type="password"
                                                        placeholder="Password"
                                                        onPressEnter={this.handleSubmit}
                                                    />
                                                </Form.Item>

                                                {/* <Form.Item>
                                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                                        <Checkbox>Remember me</Checkbox>
                                                    </Form.Item>
                                                </Form.Item> */}
                                            </div>
                                            :
                                            <div className="login__form__goback">
                                                <a onClick={() => this.setState(this.initState)}>
                                                    Go Back
                                                </a>
                                                <br />
                                            </div>
                                    }
                                    <Button type="primary" htmlType="submit" className="login__form__button">
                                        {!this.state.resetPassword ? "Log in" : "Reset Password"}
                                    </Button>
                                </Form>
                            </div>
                }
            </div>
        );
    }
}

export default Login;