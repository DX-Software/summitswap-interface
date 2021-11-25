const tokenAnalyzer = require('./tokenAnalyzer.js');

const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "report.csv",
  header: [
    { id: "address", title: "Address" },
    { id: "reality", title: "Reality" },
    { id: "failPerTransfer", title: "fail per transfer" },
    { id: "revlik", title: "reverse likelyhood" },
    { id: "lastIn100transferFails", title: "failed transfers in last 100 txs" },
    { id: "verifstat", title: "verification status" },
    { id: "non_trans", title: "non-transfers in last 100 txs" },
    { id: "failedTransactions", title: "failed transactions" },
    { id: "totalTransactions", title: "total transactions" },
    { id: "totalFailRate", title: "total fail rate" },
    { id: "scamscore", title: "scamScore" },
    { id: "conclusion", title: "conclusion" },
    { id: "accuracy", title: "accuracy" },
    { id: "falsepos", title: "false positives" },
    { id: "falseneg", title: "false negatives" },
  ],
});

const tocsv = [];

const Tokens = {
  "0x440Fc7DA66e34e01af5201BdF5815739B0Ae743f": "scam",
  "0x9165D8EBad20a9869Db8901C403784455978925F": "scam",
  "0xc1187be87397a69ee9ee5146c42a7f13a7958bcf": "scam",
  "0x15b874adb2a0505579c46138fb260a40a4bdfa94": "scam",
  "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82": "not a scam",
  "0x31d9bb2d2e971f0f2832b32f942828e1f5d82bf9": "scam",
  "0x23542e4ad3ed5f2b0d7a593d87a46ce480c76c82": "scam",
  "0x52e50DAC43425E9E568475305C252ae48Df8fF1E": "scam",
  "0x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5": "scam",
  "0x9E993671976a5AC51bBfB3Db9E34eAC8d518fe82": "scam",
  "0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3": "not a scam",
};
const TestResults = {};
const network = "b";
async function generate_report() {
  console.log(
    "Analyzing " +
      Object.keys(Tokens).length +
      " Token & creating report" +
      "\n"
  );

  console.log("0%");
  let percentage = 0;
  for (let TokenAddress of Object.keys(Tokens)) {
    percentage++;
    let obj = await tokenAnalyzer(TokenAddress, network, Tokens, TestResults);
    tocsv.push(obj);
    console.log(((percentage * 100) / Object.keys(Tokens).length).toFixed(2) + "%");
  }

  let observationResult = {};

  let true_results = 0;
  for (let i of Object.values(TestResults)) {
    true_results += i;
  }
  observationResult.accuracy =
    (true_results / Object.values(TestResults).length).toFixed(2) * 100 + "%";

  let false_positive_count = 0;
  let false_nagative_count = 0;
  let positive_count = 0;
  let negative_count = 0;
  for (let token of Object.keys(Tokens)) {
    if (TestResults[token] === 0) {
      if (Tokens[token] === "scam") {
        false_nagative_count++;
        negative_count++;
      } else {
        false_positive_count++;
        positive_count++;
      }
    } else {
      if (Tokens[token] === "scam") {
        positive_count++;
      } else {
        negative_count++;
      }
    }
  }
  observationResult.falsepos = (false_positive_count / positive_count).toFixed(2) * 100 + "%";
  observationResult.falseneg = (false_nagative_count / negative_count).toFixed(2) * 100 + "%";

  tocsv.push(observationResult);

  csvWriter
    .writeRecords(tocsv)
    .then(() => console.log("The CSV file was written successfully"));
}

generate_report();
