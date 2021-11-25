const axios = require("axios");
const cheerio = require("cheerio");


async function tokenAnalyzer(TokenAddress, network, Tokens, TestResults) {
    let observation = {};
    observation.address = TokenAddress;
    observation.reality = Tokens[TokenAddress];

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


    let urlStart = "https://bscscan.com/address/";
    let txURL = bscurl;
    let inEscan = false;

    let ts$ = bs$;
    if (network === "e") {
    } else if (network === "b") {
      transactions = bscTransactions;
    }

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
    

    let Ntxs = "";

    html = await axios(txURL);
    html = html.data;
    $ = cheerio.load(html);

    $("span.d-flex.align-items-center", html).each(function () {
      const text = $(this).text();
      Ntxs = parseInt(text.replace(/\D/g, ""));
    });

    let NFailesTxs = "";
    html = await axios(txURL + "&f=1");
    html = html.data;
    $ = cheerio.load(html);

    $("span.d-flex.align-items-center", html).each(function () {
      const text = $(this).text();
      NFailesTxs = parseInt(text.replace(/\D/g, ""));
    });
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


    let revLikelihood = 0;
    for (let add of Object.keys(exc)) {
      if (exc[add] >= 3) revLikelihood += exc[add] - 2;
    }


    observation.revlik = revLikelihood;
    let scamScore = 0;
    scamScore += lastIn100transferFails * 5;
    observation.lastIn100transferFails = lastIn100transferFails;
    if (script.length === 0) {
      scamScore += 50;
      observation.verifstat = "not verified";
    } else {
      observation.verifstat = "verified";
    }

    scamScore += revLikelihood;

    scamScore += (50 * non_trans) / transactions.length;
    observation.non_trans = non_trans;
    scamScore += (80 * NFailesTxs) / Ntxs;

    observation.failedTransactions = NFailesTxs;
    observation.totalTransactions = Ntxs;
    observation.totalFailRate = NFailesTxs / Ntxs;
    scamScore -= Ntxs / 3000;
    if (scamScore > 40 && scamScore < 50 && Ntxs < 1000) {
      scamScore += 10;
    }

    if(noIcon){
        scamScore += 30;
      }

    if (Ntxs < 500 && transferFailsRatio < 0.1) {
      scamScore -= 20 * (1 - transferFailsRatio);
    }
    let scam = false;
    let scsc = scamScore;
    if (scamScore >= 50) {
      observation.conclusion = "scam";
      if (scamScore >= 100) {
        scsc = "99%";
      } else {
        scsc = scamScore.toFixed(1) + "%";
      }
      scam = true;
    } else {
      observation.conclusion = "not a scam";
      if (scamScore <= 0) {
        scsc = "1%";
      }

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


    return observation;

  }

  module.exports = tokenAnalyzer;

