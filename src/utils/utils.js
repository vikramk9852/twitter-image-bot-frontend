class Utils {
    static removeURLFromText(text) {
        if (!text || typeof (text) !== 'string') {
            return text;
        }
        return text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    }
}

export default Utils;