"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var OutSlash = /** @class */ (function () {
    function OutSlash(graphQLClient) {
        this.graphQLClient = graphQLClient;
    }
    OutSlash.prototype.response = function (nextMatch, player) {
        return __awaiter(this, void 0, void 0, function () {
            var playerIsOut, updatedMatch, playersInMatch, playerCount, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        playerIsOut = nextMatch.playersOut.some(function (playerAlreadyOut) { return playerAlreadyOut.id === player.id; });
                        if (playerIsOut) {
                            return [2 /*return*/, this.playerWasNotIn(nextMatch.players.length)];
                        }
                        return [4 /*yield*/, this.removeFromMatch(nextMatch, player)];
                    case 1:
                        updatedMatch = _a.sent();
                        playersInMatch = updatedMatch.players;
                        playerCount = playersInMatch.length;
                        return [2 /*return*/, this.playerIsOut(playerCount)];
                    case 2:
                        e_1 = _a.sent();
                        console.log('\x1b[31m', 'error occured', e_1, '\x1b[0m');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OutSlash.prototype.playerIsOut = function (playerCount) {
        return {
            text: ":thumbsdown: You're out... BOO!",
            attachments: [
                { text: "Players so far: *" + playerCount + "*", mrkdwn_in: ['text'] }
            ]
        };
    };
    OutSlash.prototype.playerWasNotIn = function (playerCount) {
        return {
            text: ":thumbsdown: You were already not playing!",
            attachments: [
                { text: "Players so far: *" + playerCount + "*", mrkdwn_in: ['text'] }
            ]
        };
    };
    OutSlash.prototype.removeFromMatch = function (nextMatch, player) {
        return __awaiter(this, void 0, void 0, function () {
            var id, playerId, query, updateMatch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = nextMatch.id;
                        playerId = player.id;
                        console.log('\x1b[32m', 'remove from match firing in slack', id, playerId, '\x1b[0m');
                        query = "mutation{\n      removeFromMatch( id: \"" + id + "\" playerId: \"" + playerId + "\") {\n          id\n          players {\n            id\n          }\n        }\n      }";
                        return [4 /*yield*/, this.graphQLClient
                                .request(query)
                                .catch(function (e) {
                                throw e;
                            })];
                    case 1:
                        updateMatch = _a.sent();
                        console.log('\x1b[32m', 'remove updateMatch', updateMatch, '\x1b[0m');
                        return [2 /*return*/, updateMatch.removeFromMatch];
                }
            });
        });
    };
    return OutSlash;
}());
exports.OutSlash = OutSlash;
//# sourceMappingURL=out-slash.js.map