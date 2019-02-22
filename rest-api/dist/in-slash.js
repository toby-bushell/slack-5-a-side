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
var InSlash = /** @class */ (function () {
    function InSlash(graphQLClient) {
        this.graphQl = graphQLClient;
    }
    InSlash.prototype.response = function (nextMatch, player) {
        return __awaiter(this, void 0, void 0, function () {
            var playerIsIn, updatedMatch, playersInMatch, playerCount, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\x1b[34m', 'firing', '\x1b[0m');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        playerIsIn = nextMatch.players.some(function (playerAlreadyIn) { return playerAlreadyIn.id === player.id; });
                        if (playerIsIn)
                            return [2 /*return*/, this.playerAlreadyIn(nextMatch.players)];
                        return [4 /*yield*/, this.addToMatch(nextMatch, player)];
                    case 2:
                        updatedMatch = _a.sent();
                        playersInMatch = updatedMatch.players;
                        playerCount = playersInMatch.length;
                        console.log('\x1b[31m', 'player count', playerCount, '\x1b[0m');
                        if (playerCount > 10) {
                            return [2 /*return*/, this.playerCouldBeIn(playersInMatch)];
                        }
                        return [2 /*return*/, this.playerIsIn(playersInMatch)];
                    case 3:
                        e_1 = _a.sent();
                        console.log('\x1b[31m', 'error', e_1, '\x1b[0m');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    InSlash.prototype.playerIsIn = function (players) {
        return {
            text: ":+1: Wooo you're in!",
            attachments: [
                {
                    text: "Players so far: *" + players.length + "*\n" + this.playersList(players),
                    mrkdwn_in: ['text']
                }
            ]
        };
    };
    InSlash.prototype.playerAlreadyIn = function (players) {
        console.log('\x1b[32m', 'already in', players, '\x1b[0m');
        return {
            text: ":+1: You're already in!",
            attachments: [
                {
                    text: "Players so far: *" + players.length + "*\n" + this.playersList(players),
                    mrkdwn_in: ['text']
                }
            ]
        };
    };
    InSlash.prototype.playerCouldBeIn = function (players) {
        return {
            text: "You're number " + players.length + "!",
            attachments: [
                {
                    text: "You could be playing, as we have over 10 a humanoid will make the final decision. Priority is as follows: Missed out last week, Manifesto employee, Ringer"
                }
            ]
        };
    };
    InSlash.prototype.playersList = function (players) {
        return players.length > 0
            ? "" + players
                .map(function (player, i) {
                return i + 1 + ") " + player.name + " " + (String(player.userType) === 'RINGER' ? '(Ringer)' : '') + "\n";
            })
                .join('')
            : 'No players yet';
    };
    InSlash.prototype.addToMatch = function (nextMatch, player) {
        return __awaiter(this, void 0, void 0, function () {
            var id, playerId, query, updateMatch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = nextMatch.id;
                        playerId = player.id;
                        query = "mutation{\n      addToMatch( id: \"" + id + "\" playerId: \"" + playerId + "\") {\n          id\n          players {\n            id\n            name\n          }\n        }\n      }";
                        return [4 /*yield*/, this.graphQl.request(query).catch(function (e) {
                                throw e;
                            })];
                    case 1:
                        updateMatch = _a.sent();
                        console.log('\x1b[32m', 'updatematch', updateMatch, '\x1b[0m');
                        return [2 /*return*/, updateMatch.addToMatch];
                }
            });
        });
    };
    return InSlash;
}());
exports.InSlash = InSlash;
//# sourceMappingURL=in-slash.js.map