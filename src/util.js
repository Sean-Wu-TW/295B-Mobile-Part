const utils = {

    parseMsg: (secs) => {
        var t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(secs);
        return t;
    },
    calDistance: (long1, lat1, long2, lat2) => {
        // TODO: return the distance of two ppl
    }
}
export default utils;