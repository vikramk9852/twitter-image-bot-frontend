class Utils {
    static removeURLFromText(text) {
        if (!text || typeof (text) !== 'string') {
            return text;
        }
        return text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    }

    static serializeURLParameters(obj) {
        return Object.keys(obj)
            .map(key => `${key}=${encodeURIComponent(obj[key])}`)
            .join('&')
    }
}

export default Utils;