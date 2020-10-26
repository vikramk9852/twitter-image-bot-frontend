import { makeApiCall } from '../Helpers/apiHelper';
import { BASE_API_URL } from '../../constants/common';
import Firebase from '../firebase';

export default class TwitterApi {
    static searchUsers(searchString) {
        return Firebase.getInstance().getAuth().getAuthToken().then(authToken => {
            return makeApiCall({
                url: `${BASE_API_URL}/search/${searchString}`,
                method: 'GET',
                headers: { authToken },
            });
        })
    }

    static addtHandle(handle) {
        return Firebase.getInstance().getAuth().getAuthToken().then(authToken => {
            return makeApiCall({
                url: `${BASE_API_URL}/add`,
                method: 'POST',
                headers: { authToken },
                bodyParams: { handle }
            });
        })
    }
}