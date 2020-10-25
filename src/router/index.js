import React, { useEffect, useState } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import HomePage from '../containers/homepage';
import NoAccess from '../components/NoAccess';
import AddTwitterHandle from '../containers/add';
import Login from '../containers/login';
import Loader from '../components/Loader';
import Firebase from '../utils/firebase';


const adminPaths = ['/admin'];


const AppRouter = ((props) => {

    const AppRouterContent = () => {
        const [showLoader, setShowLoader] = useState(true);
        const [noAccess, setNoAccess] = useState(false);

        useEffect(() => {
            isLoggedIn();
        }, [showLoader]);

        const restrictAccess = () => {
            let url = props.location.pathname;
            setNoAccess(adminPaths.includes(url))
        }

        const isLoggedIn = () => {
            let firebase = Firebase.getInstance();
            return firebase.getAuth().checkStatus(function (user) {
                setShowLoader(false);
                if (!user) {
                    restrictAccess();
                }
            })
        }

        return showLoader ?
            <Loader />
            :
            <div>
                {noAccess ?
                    <NoAccess />
                    :
                    <Switch>
                        <Route exact path='/' component={HomePage} />
                        <Route path='/admin' component={AddTwitterHandle} />
                        <Route path='/login' component={Login} />

                    </Switch >
                }
            </div>
    }

    return (<AppRouterContent />);
})

export default AppRouter;