const axios = require("axios");
const cheerio = require("cheerio");

var fs = require("fs");

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

// bs 0x31d9bb2d2e971f0f2832b32f942828e1f5d82bf9
// es 0x21011333fa45f3564176e9A16a043Bb84f863e5d  crazy
// non verif bs 0x52e50DAC43425E9E568475305C252ae48Df8fF1E

// real token 0x514910771af9ca656af840dff83e8264ecf986ca
//0xae7ab96520de3a18e5e111b5eaab095312d7fe84
// 0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82
// bsc scam 0xc1187be87397a69ee9ee5146c42a7f13a7958bcf
// bsc scam 0x15b874adb2a0505579c46138fb260a40a4bdfa94
// bsc squid scam 0x440Fc7DA66e34e01af5201BdF5815739B0Ae743f
// {"0x440Fc7DA66e34e01af5201BdF5815739B0Ae743f": "scam"}

const Tokens = {
  "0x440Fc7DA66e34e01af5201BdF5815739B0Ae743f": "scam",
  "0x9165D8EBad20a9869Db8901C403784455978925F": "scam",
  "0xc1187be87397a69ee9ee5146c42a7f13a7958bcf": "scam",
  "0x15b874adb2a0505579c46138fb260a40a4bdfa94": "scam",
  "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82": "not a scam",
  "0x31d9bb2d2e971f0f2832b32f942828e1f5d82bf9": "scam",
  "0x23542e4ad3ed5f2b0d7a593d87a46ce480c76c82": "scam",
  "0x52e50DAC43425E9E568475305C252ae48Df8fF1E": "scam",
  "0x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5": "not a scam",
  "0x9E993671976a5AC51bBfB3Db9E34eAC8d518fe82": "scam",
  "0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3": "not a scam",
};
const TestResults = {};
const network = "b";

async function main() {
  let per = 0;
  console.log(
    "Analyzing " +
      Object.keys(Tokens).length +
      " Token & creating report" +
      "\n"
  );
  // logger.write("Analyzing " + Object.keys(Tokens).length + " Token & creating report"+ '\n\n\n');

  console.log("0%");
  for (let TokenAddress of Object.keys(Tokens)) {
    let observation = {};
    per++;
    observation.address = TokenAddress;
    observation.reality = Tokens[TokenAddress];

    //////////////// get URL and 100 last Transactions ////////////////////////
    let transactions;
    const bscTransactions = [];
    let bscurl = "https://bscscan.com/txs?a=" + TokenAddress + "&ps=100";

    let bschtml = await axios(bscurl);
    bschtml = bschtml.data;
    const bs$ = cheerio.load(bschtml);

    bs$(".u-label.u-label--xs.u-label--info", bschtml).each(function () {
      const text = bs$(this).text();
      bscTransactions.push(text);
    });
    //   logger.write(html);
    //   logger.write($(".u-label .u-label--xs .u-label--info", html));

    // const escTransactions = [];
    // let escurl = "https://etherscan.io/txs?a=" + TokenAddress + "&ps=100&p=3";

    // let eschtml = await axios(escurl);
    // eschtml = eschtml.data;
    // const es$ = cheerio.load(eschtml);

    // es$(".u-label.u-label--xs.u-label--info", eschtml).each(function () {
    //   const text = es$(this).text();
    //   escTransactions.push(text);
    // });

    //   logger.write(html);
    //   logger.write($(".u-label .u-label--xs .u-label--info", html));

    //   logger.write("escTransactions", escTransactions.length);
    //   logger.write("bscTransactions", bscTransactions.length);

    let urlStart = "https://bscscan.com/address/";
    let txURL = bscurl;
    let inEscan = false;

    let ts$ = bs$;
    // make user able to chose etherscan or bscscan
    //   if (escTransactions.length >= bscTransactions.length) {
    if (network === "e") {
      //   transactions = escTransactions;
      //   logger.write("is in etherscan");
      //   urlStart = "https://etherscan.io/address/";
      //   txURL = escurl;
      //   inEscan = true;
      //   ts$ = es$;
    } else if (network === "b") {
      transactions = bscTransactions;
      //   logger.write("is in bscscan");
    }

    //////////////// get script ////////////////////////
    let script = "";

    let url = urlStart + TokenAddress + "#code";

    let html = await axios(url);
    html = html.data;
    let $ = cheerio.load(html);

    $(".js-sourcecopyarea.editor", html).each(function () {
      const text = $(this).text();
      script = text;
    });

    //////////////// get total txs number ////////////////////////
    let Ntxs = "";

    html = await axios(txURL);
    html = html.data;
    $ = cheerio.load(html);

    $("span.d-flex.align-items-center", html).each(function () {
      const text = $(this).text();
      // logger.write(text);
      Ntxs = parseInt(text.replace(/\D/g, ""));
    });
    //   logger.write(Ntxs);

    //////////////// get failed txs number ////////////////////////
    let NFailesTxs = "";
    //   logger.write(txURL + "&f=1");
    html = await axios(txURL + "&f=1");
    html = html.data;
    $ = cheerio.load(html);

    $("span.d-flex.align-items-center", html).each(function () {
      const text = $(this).text();
      // logger.write(text);
      NFailesTxs = parseInt(text.replace(/\D/g, ""));
    });
    //   logger.write(NFailesTxs);

    // let fails = 0;
    // ts$(
    //   "span.text-warning > strong > i.fa.fa-exclamation-circle",
    //   inEscan ? eschtml : bschtml
    // ).each(function () {
    //   fails++;
    // });
    // logger.write(fails);

    // ts$(
    //   "span.text-danger > strong > i.fa.fa-exclamation-circle",
    //   inEscan ? eschtml : bschtml
    // ).each(function () {
    //   fails++;
    // });
    // logger.write(fails);

    // transfer fails
    let failedIndexs = [];
    ts$(
      "table.table.table-hover > tbody > tr",
      inEscan ? eschtml : bschtml
    ).each(function (i, elem) {
      if (
        $(this).find("span.text-warning > strong > i.fa.fa-exclamation-circle")
          .length ||
        $(this).find("span.text-danger > strong > i.fa.fa-exclamation-circle")
          .length
      ) {
        failedIndexs.push(i);
      }
    });
    // logger.write(failedIndexs);
    // logger.write(transactions);

    // fails in transfer ratio
    let non_trans = 0;
    for (let trans of transactions) {
      if (trans !== "Transfer") {
        non_trans++;
      }
    }

    let lastIn100transferFails = 0;
    failedIndexs.map((e) => {
      if (transactions[e] === "Transfer") lastIn100transferFails++;
    });

    observation.lastIn100transferFails = lastIn100transferFails;

    let transferFailsRatio = 0;

    if (transactions.length > non_trans) {
      transferFailsRatio =
        lastIn100transferFails / (transactions.length - non_trans);
    }

    observation.failPerTransfer = transferFailsRatio.toFixed(4);

    ////// calculating from address -likelihood
    let exc = {};
    ts$(
      "td > span.hash-tag.text-truncate > a",
      inEscan ? eschtml : bschtml
    ).each(function (i, elem) {
      if (
        $(this).text().length === 42 &&
        $(this).text().substring(0, 2) === "0x"
      )
        if (!exc[$(this).text()]) {
          exc[$(this).text()] = 1;
        } else {
          exc[$(this).text()]++;
        }
    });

    // let numFrom = Object.keys(exc).length > 0 ? Object.keys(exc).length : 1;

    let revLikelihood = 0;
    for (let add of Object.keys(exc)) {
      if (exc[add] >= 3) revLikelihood += exc[add] - 2;
    }

    // logger.write(exc);

    observation.revlik = revLikelihood;
    /////////////////// scamScore  //// based on contract verification + failed txs rate + non (transfer and transfer from) rate
    let scamScore = 0;
    scamScore += lastIn100transferFails * 5;
    observation.lastIn100transferFails = lastIn100transferFails;
    if (script.length === 0) {
      scamScore += 50;
      //   logger.write("token contract not verified" + '\n');
      observation.verifstat = "not verified";
    } else {
      //   logger.write("token contract verified" + '\n');
      observation.verifstat = "verified";
    }

    scamScore += revLikelihood;

    scamScore += (50 * non_trans) / transactions.length;
    observation.non_trans = non_trans;
    scamScore += (80 * NFailesTxs) / Ntxs;

    observation.failedTransactions = NFailesTxs;
    // logger.write("total transactions "+ Ntxs + '\n');
    observation.totalTransactions = Ntxs;
    observation.totalFailRate = NFailesTxs / Ntxs;
    scamScore -= Ntxs / 3000;
    if (scamScore > 40 && scamScore < 50 && Ntxs < 1000) {
      //   logger.write("here" + '\n');
      scamScore += 10;
    }

    if (Ntxs < 500 && transferFailsRatio < 0.1) {
      //   logger.write("probably a new non-scam token" + '\n');
      scamScore -= 20 * (1 - transferFailsRatio);
    }
    //   logger.write("scamScore: ", scamScore);
    let scam = false;
    let scsc = scamScore;
    if (scamScore >= 50) {
      observation.conclusion = "scam";
      if (scamScore >= 100) {
        // logger.write("scamScore = 99% ----> Probably a scam" + '\n');
        scsc = "99%";
      } else {
        scsc = scamScore.toFixed(1) + "%";
      }
      scam = true;
    } else {
      observation.conclusion = "not a scam";
      if (scamScore <= 0) {
        // logger.write("scamScore = 1% ----> Probably not a scam" + '\n');
        scsc = "1%";
      }
      // logger.write(
      //   "scamScore  = " +
      //     scamScore.toFixed(1) +
      //     "% < 50 ----> Probably not a scam"
      //     + '\n');
      else scsc = scamScore.toFixed(1) + "%";
    }
    observation.scamscore = scsc;
    if (
      (scam && Tokens[TokenAddress] === "scam") ||
      (!scam && Tokens[TokenAddress] !== "scam")
    ) {
      TestResults[TokenAddress] = 1;
    } else {
      TestResults[TokenAddress] = 0;
    }
    console.log(((per * 100) / Object.keys(Tokens).length).toFixed(2) + "%");
    // logger.write(
    //     '\n\n');
    tocsv.push(observation);
  }

  //   logger.write(
  //     "*************************************END TEST************************************"
  //     + '\n');
  // Accuracy

  let observationResult = {};

  let sum = 0;
  for (let i of Object.values(TestResults)) {
    sum += i;
  }
  //   logger.write(
  //     "Accuracy: "+
  //     (sum / Object.values(TestResults).length).toFixed(2) * 100 + "%"
  //     + '\n');
  observationResult.accuracy =
    (sum / Object.values(TestResults).length).toFixed(2) * 100 + "%";

  // False positive/negative
  let fpos = 0;
  let fneg = 0;
  let pos = 0;
  let neg = 0;
  for (let tok of Object.keys(Tokens)) {
    if (TestResults[tok] === 0) {
      if (Tokens[tok] === "scam") {
        fneg++;
        neg++;
      } else {
        fpos++;
        pos++;
      }
    } else {
      if (Tokens[tok] === "scam") {
        pos++;
      } else {
        neg++;
      }
    }
  }
  //   logger.write(fneg);
  //   logger.write(Object.keys(Tokens).length);
  //   logger.write(sum);
  //   logger.write("false positive: "+ (fpos / pos).toFixed(2) * 100 + "%" + '\n');
  observationResult.falsepos = (fpos / pos).toFixed(2) * 100 + "%";
  //   logger.write(
  //     "false negative: "+
  //     ((fneg / (neg)).toFixed(2) * 100) + "%" + '\n'
  //   );
  observationResult.falseneg = (fneg / neg).toFixed(2) * 100 + "%";

  tocsv.push(observationResult);

  csvWriter
    .writeRecords(tocsv)
    .then(() => console.log("The CSV file was written successfully"));
}

main();
