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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: 'variables.env' });
var express = require("express");
var helmet = require('helmet');
var bodyParser = require('body-parser');
var endpoint = process.env.GRAPHQL_ENDPOINT;
var app = express();
var server = require('http').createServer(app);
var in_slash_1 = require("./in-slash");
var help_slash_1 = require("./help-slash");
var info_slash_1 = require("./info-slash");
var out_slash_1 = require("./out-slash");
var balance_slash_1 = require("./balance-slash");
var error_messages_1 = require("./error-messages");
var reminders_1 = require("./reminders");
var authenticate_1 = require("./authenticate");
var GraphQLClient = require('graphql-request').GraphQLClient;
var _a = require('./encryption'), encrypt = _a.encrypt, decrypt = _a.decrypt;
var graphQLClient = new GraphQLClient(endpoint, {
    headers: {
        authorization: encrypt(process.env.SLACK_TO_GRAPHQL_PASSWORD)
    }
});
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.post('/send-reminder', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var auth, _a, player, match, reminders;
    return __generator(this, function (_b) {
        auth = req.headers.authorization;
        // If auth headers sent
        if (!auth || decrypt(auth) !== process.env.SLACK_TO_GRAPHQL_PASSWORD) {
            return [2 /*return*/, res.json('Not authenticated')];
        }
        _a = req.body, player = _a.player, match = _a.match;
        if (!player || !match)
            return [2 /*return*/, res.json('need to provide a player and a match')];
        reminders = new reminders_1.Reminders(graphQLClient);
        try {
            reminders.sendMessage(player.slackId, match);
        }
        catch (e) {
            throw e;
        }
        return [2 /*return*/, res.json('Message sent')];
    });
}); });
// app.post('/set-reminders', async (req, res) => {
//   // If auth headers sent
//   if (!auth || decrypt(auth) !== process.env.SLACK_TO_GRAPHQL_SECRET) {
//     return res.json('Not authenticated');
//   }
//   const { matchId } = req.body;
//   if (!matchId) return res.json('need a matchId');
//   const Reminders = new reminders(graphQLClient);
//   try {
//     Reminders.setup(match);
//   } catch (e) {
//     throw e;
//   }
//   return res.json('Reminder set up');
// });
app.use(authenticate_1.default);
/**
 * Handle slash commands
 */
app.post('/slash', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var body, text, playersQuery, playerResponse, player, matchesQuery, nextMatchResponse, nextMatch, messageToRespond, helpSlash, _a, inSlash, infoSlash, outSlash, balanceSlash;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                body = req.body;
                text = body.text;
                console.log('\x1b[31m', 'req.body', req.body, '\x1b[0m');
                playersQuery = "{\n    players(where: {slackId: \"" + body.user_id + "\" }) {\n      id\n      name\n      slackId\n      payments {\n        time\n        amountPaid\n      }\n      matchesPlayed {\n        time\n      }\n    }\n  }";
                return [4 /*yield*/, graphQLClient
                        .request(playersQuery)
                        .catch(function (e) { return res.json(e.message); })];
            case 1:
                playerResponse = _b.sent();
                console.log('\x1b[32m', 'playerResponse', playerResponse, '\x1b[0m');
                player = playerResponse.players[0];
                // If no player in DB return
                if (!player)
                    return [2 /*return*/, res.json(error_messages_1.ErrorMessages.noPlayerInDb)];
                matchesQuery = "{\n    nextMatch {\n      id\n      time\n      players(orderBy: createdAt_DESC) {\n        id\n        name\n        userType\n      }\n       playersOut{\n         id \n         name \n         userType\n      }\n    }\n  }";
                return [4 /*yield*/, graphQLClient
                        .request(matchesQuery)
                        .catch(function (e) { return res.json(e.message); })];
            case 2:
                nextMatchResponse = _b.sent();
                nextMatch = nextMatchResponse.nextMatch[0];
                // If no match return
                if (!nextMatch)
                    return [2 /*return*/, res.json(error_messages_1.ErrorMessages.noMatchSet)];
                helpSlash = new help_slash_1.HelpSlash();
                _a = text;
                switch (_a) {
                    case 'in': return [3 /*break*/, 3];
                    case 'info': return [3 /*break*/, 5];
                    case 'out': return [3 /*break*/, 7];
                    case 'balance': return [3 /*break*/, 9];
                    case 'help': return [3 /*break*/, 11];
                }
                return [3 /*break*/, 13];
            case 3:
                inSlash = new in_slash_1.InSlash(graphQLClient);
                return [4 /*yield*/, inSlash.response(nextMatch, player)];
            case 4:
                messageToRespond = _b.sent();
                return [3 /*break*/, 15];
            case 5:
                infoSlash = new info_slash_1.InfoSlash(graphQLClient);
                return [4 /*yield*/, infoSlash.response(nextMatch)];
            case 6:
                messageToRespond = _b.sent();
                return [3 /*break*/, 15];
            case 7:
                outSlash = new out_slash_1.OutSlash(graphQLClient);
                return [4 /*yield*/, outSlash.response(nextMatch, player)];
            case 8:
                messageToRespond = _b.sent();
                return [3 /*break*/, 15];
            case 9:
                balanceSlash = new balance_slash_1.BalanceSlash(graphQLClient);
                return [4 /*yield*/, balanceSlash.response(player)];
            case 10:
                messageToRespond = _b.sent();
                console.log('messageToRespond', messageToRespond);
                return [3 /*break*/, 15];
            case 11: return [4 /*yield*/, helpSlash.response()];
            case 12:
                messageToRespond = _b.sent();
                return [3 /*break*/, 15];
            case 13: return [4 /*yield*/, helpSlash.response(":interrobang: Oops, we don't recognise that command, did you mean :point_down:")];
            case 14:
                // if (text.includes('add-ringer')) {
                //   const addRinger = new AddRinger(db);
                //   messageToRespond = await addRinger.response(
                //     nextMatch,
                //     text.replace('add-ringer', '').trim()
                //   );
                // } else if (text.includes('remove-ringer')) {
                //   const removeRinger = new RemoveRinger(db);
                //   messageToRespond = await removeRinger.response(
                //     nextMatch,
                //     text.replace('remove-ringer', '').trim()
                //   );
                // }
                messageToRespond = _b.sent();
                return [3 /*break*/, 15];
            case 15:
                res.json(messageToRespond);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Receives button message response from slack
 */
app.post('/interactive', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var parsed, actionValue, callback_id, matchesQuery, nextMatchResponse, nextMatch, playersQuery, playersQueryResponse, player, messageToRespond, inSlash, outSlash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('\x1b[31m', 'interactive firing at least', '\x1b[0m');
                parsed = JSON.parse(req.body.payload);
                actionValue = parsed.actions[0].value;
                callback_id = parsed.callback_id;
                matchesQuery = "{\n    matches(where: {id: \"" + callback_id + "\"}) {\n      id\n      time\n      players(orderBy: createdAt_DESC) {\n        id\n        name\n        userType\n      }\n       playersOut{\n         id \n         name \n         userType\n      }\n    }\n  }";
                return [4 /*yield*/, graphQLClient
                        .request(matchesQuery)
                        .catch(function (e) { return res.json(e.message); })];
            case 1:
                nextMatchResponse = _a.sent();
                console.log('\x1b[32m', 'nextMatchResponse', nextMatchResponse, '\x1b[0m');
                nextMatch = nextMatchResponse.matches[0];
                playersQuery = "{\n    players(where: {slackId: \"" + parsed.user.id + "\"}) {\n      id\n      name\n      slackId\n      username\n      reminders\n    }\n  }";
                return [4 /*yield*/, graphQLClient
                        .request(playersQuery)
                        .catch(function (e) { return res.json(e.message); })];
            case 2:
                playersQueryResponse = _a.sent();
                player = playersQueryResponse.players[0];
                if (!(actionValue === 'in')) return [3 /*break*/, 4];
                inSlash = new in_slash_1.InSlash(graphQLClient);
                return [4 /*yield*/, inSlash.response(nextMatch, player)];
            case 3:
                messageToRespond = _a.sent();
                return [3 /*break*/, 7];
            case 4:
                if (!(actionValue === 'out')) return [3 /*break*/, 6];
                outSlash = new out_slash_1.OutSlash(graphQLClient);
                return [4 /*yield*/, outSlash.response(nextMatch, player)];
            case 5:
                messageToRespond = _a.sent();
                return [3 /*break*/, 7];
            case 6:
                messageToRespond = {
                    text: "Ooops something went wrong"
                };
                _a.label = 7;
            case 7: return [2 /*return*/, res.json(messageToRespond)];
        }
    });
}); });
var port = process.env.PORT || 3002;
server.listen(port, function () { return __awaiter(_this, void 0, void 0, function () {
    var reminders;
    return __generator(this, function (_a) {
        console.log("Find the server at: http://localhost:" + port + "/"); // eslint-disable-line no-console
        reminders = new reminders_1.Reminders(graphQLClient);
        reminders.setAllReminders();
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=index.js.map