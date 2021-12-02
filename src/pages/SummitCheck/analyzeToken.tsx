import getTokenInfos from '../../utils/tokenAnalyzer/withBSCAPI/getTokenInfos';

import decide from '../../utils/tokenAnalyzer/withBSCAPI/decide';

const apikey = 'ISMIHCDD1TKJ4R3T2X4S76YC8RT9KS2SAG';

async function analyzeToken(TokenAddress) {
  let observation = {} as any;
  observation = await getTokenInfos(TokenAddress, apikey);

  observation.scamScore = decide(observation);

  let scam = false;
  let scsc = observation.scamScore;
  if (observation.scamScore >= 50) {
    observation.conclusion = 'scam';
    if (observation.scamScore >= 100) {
      scsc = '99%';
    } else {
      scsc = `${observation.scamScore.toFixed(1)} %`;
    }
    scam = true;
  } else {
    observation.conclusion = 'not a scam';
    if (observation.scamScore <= 0) {
      scsc = '1%';
    } else scsc = `${observation.scamScore.toFixed(1)} '%'`;
  }
  observation.scamScore = scsc;

  return observation;
}

export default  analyzeToken 
