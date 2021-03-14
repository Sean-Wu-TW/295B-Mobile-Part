const utils = {

    parseMsg: (payload) => {
        function toDateTime(secs) {
        var t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(secs);
        return t;
        }
    }
}
export default utils;