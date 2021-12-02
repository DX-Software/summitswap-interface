const getTokenInfos = require("./getTokenInfos.js");
const decide = require("./decide.js");
const apikey = "ISMIHCDD1TKJ4R3T2X4S76YC8RT9KS2SAG";

async function analyzeOne(TokenAddress, Tokens, TestResults) {
  let observation = {};
  observation = await getTokenInfos(TokenAddress, apikey);

  observation.address = TokenAddress;

  observation.reality = Tokens[TokenAddress];
  observation.scamScore = decide(observation);

  let scam = false;
  let scsc = observation.scamScore;
  if (observation.scamScore >= 50) {
    observation.conclusion = "scam";
    if (observation.scamScore >= 100) {
      scsc = "99%";
    } else {
      scsc = observation.scamScore.toFixed(1) + "%";
    }
    scam = true;
  } else {
    observation.conclusion = "not a scam";
    if (observation.scamScore <= 0) {
      scsc = "1%";
    } else scsc = observation.scamScore.toFixed(1) + "%";
  }
  observation.scamScore = scsc;
  if (
    (scam && Tokens[TokenAddress] === "scam") ||
    (!scam && Tokens[TokenAddress] !== "scam")
  ) {
    TestResults[TokenAddress] = 1;
  } else {
    TestResults[TokenAddress] = 0;
  }

  return observation;
}

module.exports = analyzeOne;
