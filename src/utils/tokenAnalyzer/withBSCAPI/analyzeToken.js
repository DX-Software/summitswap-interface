const getTokenInfos = require('./getTokenInfos.js');
const decide = require('./decide.js');

const TokenAddress = "0xf32a8d06e1fe3391d52eb6026aac91cbc0292a40";

const apikey = "APIKEY";


getTokenInfos(TokenAddress, apikey).then((infos) => decide(infos));

