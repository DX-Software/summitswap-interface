const axios = require("axios");
const cheerio = require("cheerio");

// bs 0x31d9bb2d2e971f0f2832b32f942828e1f5d82bf9
// es 0x21011333fa45f3564176e9A16a043Bb84f863e5d  crazy
// non verif bs 0x52e50DAC43425E9E568475305C252ae48Df8fF1E

// real token 0x514910771af9ca656af840dff83e8264ecf986ca
//0xae7ab96520de3a18e5e111b5eaab095312d7fe84
// 0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82
// bsc scam 0xc1187be87397a69ee9ee5146c42a7f13a7958bcf
// bsc scam 0x15b874adb2a0505579c46138fb260a40a4bdfa94
// bsc squid scam 0x440Fc7DA66e34e01af5201BdF5815739B0Ae743f
// bsc koda v2 0x8094e772fA4A60bdEb1DfEC56AB040e17DD608D5

const TokenAddress = "0x31d9bb2d2e971f0f2832b32f942828e1f5d82bf9";
const network = "b";

async function main() {
  console.log(TokenAddress);

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
  //   console.log(html);
  //   console.log($(".u-label .u-label--xs .u-label--info", html));

  const escTransactions = [];
  let escurl = "https://etherscan.io/txs?a=" + TokenAddress + "&ps=100&p=3";

  let eschtml = await axios(escurl);
  eschtml = eschtml.data;
  const es$ = cheerio.load(eschtml);

  es$(".u-label.u-label--xs.u-label--info", eschtml).each(function () {
    const text = es$(this).text();
    escTransactions.push(text);
  });
  //   console.log(html);
  //   console.log($(".u-label .u-label--xs .u-label--info", html));

  //   console.log("escTransactions", escTransactions.length);
  //   console.log("bscTransactions", bscTransactions.length);

  let urlStart = "https://bscscan.com/address/";
  let txURL = bscurl;
  let inEscan = false;

  let ts$ = bs$;
  // make user able to chose etherscan or bscscan
  //   if (escTransactions.length >= bscTransactions.length) {
  if (network === "e") {
    transactions = escTransactions;
    console.log("is in etherscan");
    urlStart = "https://etherscan.io/address/";
    txURL = escurl;
    inEscan = true;
    ts$ = es$;
  } else if (network === "b") {
    transactions = bscTransactions;
    console.log("is in bscscan");
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

  let noIcon = false;
  $(".row.align-items-center > .col-md-8 > img", html).each(function () {
    const text = $(this).attr("src");

    if(text === "/images/main/empty-token.png"){
      noIcon = true;
    }
  });

  //////////////// get total txs number ////////////////////////
  let Ntxs = "";

  html = await axios(txURL);
  html = html.data;
  $ = cheerio.load(html);

  $("span.d-flex.align-items-center", html).each(function () {
    const text = $(this).text();
    // console.log(text);
    Ntxs = parseInt(text.replace(/\D/g, ""));
  });
  //   console.log(Ntxs);

  //////////////// get failed txs number ////////////////////////
  let NFailesTxs = "";
  //   console.log(txURL + "&f=1");
  html = await axios(txURL + "&f=1");
  html = html.data;
  $ = cheerio.load(html);

  $("span.d-flex.align-items-center", html).each(function () {
    const text = $(this).text();
    // console.log(text);
    NFailesTxs = parseInt(text.replace(/\D/g, ""));
  });
  //   console.log(NFailesTxs);

  // let fails = 0;
  // ts$(
  //   "span.text-warning > strong > i.fa.fa-exclamation-circle",
  //   inEscan ? eschtml : bschtml
  // ).each(function () {
  //   fails++;
  // });
  // console.log(fails);

  // ts$(
  //   "span.text-danger > strong > i.fa.fa-exclamation-circle",
  //   inEscan ? eschtml : bschtml
  // ).each(function () {
  //   fails++;
  // });
  // console.log(fails);

  // transfer fails
  let failedIndexs = [];
  ts$("table.table.table-hover > tbody > tr", inEscan ? eschtml : bschtml).each(
    function (i, elem) {
      if (
        $(this).find("span.text-warning > strong > i.fa.fa-exclamation-circle")
          .length ||
        $(this).find("span.text-danger > strong > i.fa.fa-exclamation-circle")
          .length
      ) {
        failedIndexs.push(i);
      }
    }
  );
  // console.log(failedIndexs);
  // console.log(transactions);

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

  let transferFailsRatio =
    lastIn100transferFails /
    (transactions.length - non_trans > 0 ? transactions.length - non_trans : 1);

  console.log(
    "fail per transfer in last 100 = ",
    transferFailsRatio.toFixed(4)
  );

  ////// calculating from address -likelihood
  let exc = {};
  ts$("td > span.hash-tag.text-truncate > a", inEscan ? eschtml : bschtml).each(
    function (i, elem) {
      if (
        $(this).text().length === 42 &&
        $(this).text().substring(0, 2) === "0x"
      )
        if (!exc[$(this).text()]) {
          exc[$(this).text()] = 1;
        } else {
          exc[$(this).text()]++;
        }
    }
  );

  // let numFrom = Object.keys(exc).length > 0 ? Object.keys(exc).length : 1;

  let revLikelihood = 0;
  for (let add of Object.keys(exc)) {
    if (exc[add] >= 3) revLikelihood += exc[add] - 2;
  }

  // console.log(exc);
  console.log("reverse Likelihood = ", revLikelihood);

  /////////////////// scamScore  //// based on contract verification + failed txs rate + non (transfer and transfer from) rate
  let scamScore = 0;
  scamScore += lastIn100transferFails * 5;
  console.log("lastIn100transferFails", lastIn100transferFails);
  if (script.length === 0) {
    scamScore += 50;
    console.log("token contract not verified");
  } else {
    console.log("token contract verified");
  }

  scamScore += revLikelihood;

  scamScore += (50 * non_trans) / transactions.length;
  console.log("non_trans ", non_trans);
  scamScore += (80 * NFailesTxs) / Ntxs;
  console.log("failed transactions", NFailesTxs);
  console.log("total transactions", Ntxs);
  scamScore -= Ntxs / 3000;
  if (scamScore > 40 && scamScore < 50 && Ntxs < 1000) {
    console.log("here");
    scamScore += 10;
  }

  if(noIcon){
    scamScore += 30;
  }


  if (Ntxs < 500 && transferFailsRatio < 0.1) {
    console.log("probably a new non-scam token");
    scamScore -= 20 * (1 - transferFailsRatio);
  }
  //   console.log("scamScore: ", scamScore);
  if (scamScore >= 50) {
    if (scamScore >= 100) {
      console.log("scamScore = 99% ----> Probably a scam");
    } else {
      console.log(
        "scamScore = " + scamScore.toFixed(1) + "% >= 50 ----> Probably a scam"
      );
    }
  } else {
    if (scamScore <= 0) {
      console.log("scamScore = 1% ----> Probably not a scam");
    } else
      console.log(
        "scamScore  = " +
          scamScore.toFixed(1) +
          "% < 50 ----> Probably not a scam"
      );
  }
}

main();
