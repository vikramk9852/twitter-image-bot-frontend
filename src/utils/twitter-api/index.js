import { makeApiCall } from '../ApiHelper/index'

export default class TwitterApi {
    static searchUsers(searchString) {
        return makeApiCall({ url: `/search/${searchString}` });
    }

    static addtHandle(handle) {
        return makeApiCall({ url: `/add`, method: 'POST', bodyParams: { handle } });
    }
}