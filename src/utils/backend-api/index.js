import { makeApiCall } from '../Helpers/apiHelper';
import { ADD_USER_ENDPOINT, BASE_API_URL, GET_ALL_USERS_ENDPOINT, GET_USER_DATA_ENDPOINT, SEARCH_ENDPOINT } from '../../constants/common';
import Firebase from '../firebase';
import Utils from '../utils';

export default class BackendAPI {
    static searchUsers(searchString) {
        return Firebase.getInstance().getAuth().getAuthToken().then(authToken => {
            return makeApiCall({
                url: `${BASE_API_URL}/${SEARCH_ENDPOINT}/${searchString}`,
                method: 'GET',
                headers: { authToken },
            });
        })
    }

    static addUser(user) {
        return Firebase.getInstance().getAuth().getAuthToken().then(authToken => {
            return makeApiCall({
                url: `${BASE_API_URL}/${ADD_USER_ENDPOINT}`,
                method: 'POST',
                headers: { authToken },
                bodyParams: { user }
            });
        })
    }

    static getAllUsers() {
        return makeApiCall({
            url: `${BASE_API_URL}/${GET_ALL_USERS_ENDPOINT}`,
            method: 'GET',
        });
    }

    static getUserData(user, pageNo, orderBy, nPerPage) {
        return makeApiCall({
            url: `${BASE_API_URL}/${GET_USER_DATA_ENDPOINT}?${Utils.serializeURLParameters({
                user,
                pageNo,
                nPerPage,
                orderBy
            })}`,
            method: 'GET',
        });
    }
}