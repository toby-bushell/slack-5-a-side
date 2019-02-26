// https://github.com/rommelsantor/Timeout/blob/master/src/timeout.js
var Timeout = (function () {
    var keyId = {};
    var metadata = {};
    var clear = function (key, erase) {
        if (erase === void 0) { erase = true; }
        clearTimeout(keyId[key]);
        delete keyId[key];
        if (erase) {
            delete metadata[key];
        }
    };
    // set(key, func, ms = 0) -- user-defined key
    // set(func, ms = 0) -- func used as key
    //
    // returns a function allowing you to test if it has executed
    var set = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var key, func, ms;
        if (args.length === 0) {
            throw Error('Timeout.set() requires at least one argument');
        }
        if (typeof args[0] === 'function') {
            func = args[0], ms = args[1];
            key = func.toString();
        }
        else {
            key = args[0], func = args[1], ms = args[2];
        }
        if (!func) {
            throw Error('Timeout.set() requires a function parameter');
        }
        clear(key);
        var invoke = function () { return ((metadata[key] = false), func()); };
        keyId[key] = setTimeout(invoke, ms || 0);
        metadata[key] = {
            func: func,
            key: key,
            ms: ms,
            paused: false,
            startTime: new Date().getTime(),
            timeSpentWaiting: 0
        };
        return function () { return executed(key); };
    };
    // timeout has been created
    var exists = function (key) { return key in keyId || metadata[key] !== undefined; };
    // test if a timeout has run
    var executed = function (key) { return metadata[key] === false; };
    // timeout does exist, but has not yet run
    var pending = function (key) { return exists(key) && !executed(key); };
    // timeout does exist, but will not execute because it is paused
    var paused = function (key) { return exists(key) && metadata[key].paused; };
    // pause our execution countdown until we're ready for it to resume
    var pause = function (key) {
        if (!metadata[key] || paused(key))
            return false;
        clear(key, false);
        metadata[key].paused = true;
        metadata[key].timeSpentWaiting =
            new Date().getTime() - metadata[key].startTime;
        return metadata[key].timeSpentWaiting;
    };
    var resume = function (key) {
        if (!metadata[key])
            return false;
        var _a = metadata[key], func = _a.func, ms = _a.ms, paused = _a.paused, timeSpentWaiting = _a.timeSpentWaiting;
        if (!paused)
            return false;
        var remainingTime = ms - timeSpentWaiting;
        return set(key, func, remainingTime);
    };
    var remaining = function (key) {
        if (!metadata[key])
            return 0;
        var _a = metadata[key], ms = _a.ms, startTime = _a.startTime, timeSpentWaiting = _a.timeSpentWaiting;
        return paused(key)
            ? ms - timeSpentWaiting
            : Math.max(0, startTime + ms - new Date().getTime());
    };
    return {
        clear: clear,
        executed: executed,
        exists: exists,
        pause: pause,
        paused: paused,
        pending: pending,
        remaining: remaining,
        resume: resume,
        set: set
    };
})();
module.exports = Timeout;
//# sourceMappingURL=timeout.js.map