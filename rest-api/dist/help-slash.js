"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpSlash = /** @class */ (function () {
    function HelpSlash() {
    }
    HelpSlash.prototype.response = function (errorMessage) {
        if (errorMessage === void 0) { errorMessage = null; }
        var message = errorMessage || ':wave: Need some help with `/footie`?';
        return {
            text: message,
            attachments: [
                {
                    text: '• `/footie in` to opt in to the upcoming game \n• `/footie out` to opt out of the upcoming game  \n• `/footie info` to get some info about the next game! \n• `/footie balance` to get your current balance',
                    mrkdwn_in: ['text']
                }
            ]
        };
    };
    return HelpSlash;
}());
exports.HelpSlash = HelpSlash;
//# sourceMappingURL=help-slash.js.map