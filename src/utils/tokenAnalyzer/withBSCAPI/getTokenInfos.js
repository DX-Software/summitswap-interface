const axios = require("axios");

async function getTokenInfos(TokenAddress, apikey) {
  let infos = {};
  const offset = 10000;
  let start = Date.now();
  console.log(TokenAddress);
  let page = 1;

  let bscurl =
    "https://api.bscscan.com/api?module=account&action=txlist&address=" +
    TokenAddress +
    "&startblock=0&endblock=99999999&page=" +
    page +
    "&offset=" +
    offset +
    "&sort=desc&apikey=" +
    apikey;

  let abiUrl =
    "https://api.bscscan.com/api?module=contract&action=getabi&address=" +
    TokenAddress +
    "&apikey=" +
    apikey;

  infos.bscTransactions = await axios(bscurl);
  infos.bscTransactions = infos.bscTransactions.data.result;

  infos.script = await axios(abiUrl);
  infos.script = infos.script.data.status;

  infos.Ntxs = 0;
  let txs = infos.bscTransactions;
  infos.Ntxs += txs.length;

  while (txs.length === 10000) {
    page++;
    txs = await axios(
      "https://api.bscscan.com/api?module=account&action=txlist&address=" +
        TokenAddress +
        "&startblock=0&endblock=9999999999999&page=" +
        page +
        "&offset=" +
        offset +
        "&sort=desc&apikey=" +
        apikey
    );

    if (!txs.data.result) {
      break;
    } else {
      txs = txs.data.result;
      infos.bscTransactions = [...infos.bscTransactions, ...txs];
      infos.Ntxs += txs.length;
      if (infos.bscTransactions.length >= 30000) {
        break;
      }
    }
  }

  //////////////// get total non transfers number ////////////////////////
  //////////////// get failed transfers number ////////////////////////
  //////////////// get failed txs number ////////////////////////

  infos.NumberOfTransfers = 0;
  let NumberOfFailedTransfers = 0;
  infos.NumberOfFailedTransactions = 0;
  let exc = {};

  for (let tx of infos.bscTransactions) {
    if (tx.input.substring(0, 17) === "0xa9059cbb0000000") {
      infos.NumberOfTransfers++;
      if (tx.isError === "1") {
        NumberOfFailedTransfers++;
      }
    }
    if (tx.isError === "1") {
      infos.NumberOfFailedTransactions++;
    }
    if (tx.from.length === 42 && tx.from.substring(0, 2) === "0x") {
      if (!exc[tx.from]) {
        exc[tx.from] = 1;
      } else exc[tx.from]++;
    }

    if (tx.to.length === 42 && tx.to.substring(0, 2) === "0x") {
      if (!exc[tx.to]) {
        exc[tx.to] = 1;
      } else exc[tx.to]++;
    }
  }

  infos.non_transfersCount =
    infos.bscTransactions.length - infos.NumberOfTransfers;

  infos.transferFailsRatio =
    NumberOfFailedTransfers /
    (infos.NumberOfTransfers > 0 ? infos.NumberOfTransfers : 1);

  console.log(
    "fail per transfer ratio = ",
    infos.transferFailsRatio.toFixed(4)
  );

  infos.revLikelihood = 0;
  for (let add of Object.keys(exc)) {
    if (exc[add] >= 3) infos.revLikelihood += exc[add] - 2;
  }

  infos.revLikelihood = infos.revLikelihood / Object.keys(exc).length;

  // console.log(exc);
  console.log("reverse Likelihood = ", infos.revLikelihood);

  const millis = Date.now() - start;
  console.log(`operation time = ${Math.floor(millis / 1000)} Seconds`);
  infos.failRatio = infos.NumberOfFailedTransactions / infos.Ntxs;
  infos.non_transfers_ratio = infos.non_transfersCount / infos.Ntxs;
  delete infos.bscTransactions;
  return infos;
}

module.exports = getTokenInfos;
