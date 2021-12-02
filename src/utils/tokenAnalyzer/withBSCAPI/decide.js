function decide(infos) {
  let scamScore = 0;
  if (infos.script !== "1") {
    scamScore += 45;
    console.log("token contract not verified");
  } else {
    console.log("token contract verified");
  }

  scamScore += 10 * infos.revLikelihood;
  infos.non_transfers_mean_deviation = Math.abs(
    infos.non_transfersCount / infos.Ntxs - 0.5
  );
  scamScore += 150 * infos.non_transfers_mean_deviation;
  console.log("non_trans ", infos.non_transfersCount);
  scamScore += (80 * infos.NumberOfFailedTransactions) / infos.Ntxs;
  console.log("failed transactions", infos.NumberOfFailedTransactions);
  console.log("total transactions", infos.Ntxs);
  scamScore -= infos.Ntxs / 3000;
  if (scamScore > 40 && scamScore < 50 && infos.Ntxs < 1000) {
    scamScore += 10;
  }
  scamScore += infos.transferFailsRatio * 100;

  let newToken = false;
  if (
    infos.Ntxs < 500 &&
    infos.transferFailsRatio < 0.1 &&
    infos.NumberOfTransfers / infos.Ntxs > 0.2
  ) {
    scamScore -= 20 * (1 - infos.transferFailsRatio);
    newToken = true;
  }
  if (scamScore >= 50) {
    if (scamScore >= 100) {
      console.log("scamScore = 99% ----> Probably a scam");
    } else {
      console.log(
        `scamScore = ${scamScore.toFixed(1)} % >= 50 ----> Probably a scam`
      );
    }
  } else {
    if (newToken) {
      console.log("probably a new non-scam token");
    }
    if (scamScore <= 0) {
      console.log("scamScore = 1% ----> Probably not a scam");
    } else
      console.log(
        `scamScore  = ${scamScore.toFixed(1)} % < 50 ----> Probably not a scam`
      );
  }
  return scamScore;
}
module.exports = decide;
