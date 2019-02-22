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
var WebClient = require('@slack/client').WebClient;
var moment = require('moment');
require('dotenv').config({ path: 'variables.env' });
var token = process.env.SLACK_TOKEN;
var web = new WebClient(token);
var Timeout = require('../utils/timeout.js');
var Reminders = /** @class */ (function () {
    function Reminders(graphQLClient) {
        this.graphQLClient = graphQLClient;
    }
    Reminders.prototype.setup = function (match) {
        return __awaiter(this, void 0, void 0, function () {
            var reminderTime, id, timer, quickTimer;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!match)
                            throw 'no match set';
                        console.log('\x1b[32m', 'setup match', match, '\x1b[0m');
                        reminderTime = match.reminderTime, id = match.id;
                        return [4 /*yield*/, this.getSecondsTillReminder(reminderTime)];
                    case 1:
                        timer = _a.sent();
                        console.log('\x1b[31m', 'timer', timer, reminderTime, '\x1b[0m');
                        if (timer < 0)
                            return [2 /*return*/];
                        quickTimer = 2000;
                        return [4 /*yield*/, Timeout.set(id, function () { return _this.sendReminder(match); }, timer)];
                    case 2:
                        _a.sent();
                        // 3) Just return
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Reminders.prototype.getSecondsTillReminder = function (reminderTime) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, moment(reminderTime).diff(moment())];
            });
        });
    };
    Reminders.prototype.sendReminder = function (match) {
        return __awaiter(this, void 0, void 0, function () {
            var playersToSend;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!match)
                            throw 'No match id';
                        return [4 /*yield*/, this.getPlayersToSend(match.players || [], match.playersOut || [])];
                    case 1:
                        playersToSend = _a.sent();
                        console.log('\x1b[31m', 'players to send', playersToSend, '\x1b[0m');
                        // 3) Send reminder to each player
                        return [2 /*return*/, playersToSend.forEach(function (player) {
                                _this.sendMessage(player.slackId, match);
                            })];
                }
            });
        });
    };
    Reminders.prototype.sendMessage = function (playerSlackId, match) {
        return __awaiter(this, void 0, void 0, function () {
            var time, formattedTime, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        time = match.time;
                        formattedTime = moment(time).format('Do MMMM');
                        return [4 /*yield*/, web.chat.postMessage({
                                channel: playerSlackId,
                                text: "Next match: *" + formattedTime + "*",
                                attachments: this.generateQuestion(match.id)
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Reminders.prototype.getPlayersToSend = function (confirmedPlayers, playersOut) {
        return __awaiter(this, void 0, void 0, function () {
            var query, playersResponse, allPossible, playersToNotSend;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "query{\n      players(where: {userType: MANIFESTO}) {\n        id name slackId\n        }\n      }";
                        return [4 /*yield*/, this.graphQLClient
                                .request(query)
                                .catch(function (e) {
                                throw e;
                            })];
                    case 1:
                        playersResponse = _a.sent();
                        allPossible = playersResponse.players;
                        playersToNotSend = confirmedPlayers.concat(playersOut);
                        // console.log('playersToNotSend', playersToNotSend);
                        // console.log('allPossible', allPossible);
                        // Return players that are not already confirmed for the upcoming match
                        return [2 /*return*/, allPossible.filter(function (possible) {
                                return (playersToNotSend.length === 0 ||
                                    playersToNotSend.some(function (playerToNotSend) { return playerToNotSend.id !== possible.id; }));
                            })];
                }
            });
        });
    };
    Reminders.prototype.generateQuestion = function (matchId) {
        return [
            {
                text: 'Are you playing?',
                fallback: 'You can\t see butons',
                callback_id: "" + matchId,
                color: '#e50056',
                attachment_type: 'default',
                actions: [
                    {
                        name: 'playing',
                        text: "I'm In",
                        type: 'button',
                        value: 'in'
                    },
                    {
                        name: 'playing',
                        text: 'Out',
                        type: 'button',
                        value: 'out'
                    }
                ]
            }
        ];
    };
    Reminders.prototype.setAllReminders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, futureMatchesResponse, matches, reminderArray, reminders;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "query{\n      futureMatches {\n        id \n        time \n        reminderTime \n        playersOut { id name userType }\n        players (orderBy:createdAt_DESC) { id name userType }\n        }\n      }";
                        return [4 /*yield*/, this.graphQLClient
                                .request(query)
                                .catch(function (e) {
                                throw e;
                            })];
                    case 1:
                        futureMatchesResponse = _a.sent();
                        matches = futureMatchesResponse.futureMatches;
                        reminderArray = matches.map(function (match) { return __awaiter(_this, void 0, void 0, function () {
                            var reminder;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.setup(match)];
                                    case 1:
                                        reminder = _a.sent();
                                        return [2 /*return*/, reminder];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(reminderArray)];
                    case 2:
                        reminders = _a.sent();
                        // Return once all reminders are set
                        return [2 /*return*/, reminders];
                }
            });
        });
    };
    return Reminders;
}());
exports.Reminders = Reminders;
//# sourceMappingURL=reminders.js.map