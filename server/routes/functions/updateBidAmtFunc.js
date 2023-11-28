const { getCurrentBid, updateKeywordBid } = require('./adkeywordAPI.js');

const updateBidAmtFunc = async (adRankNum, adGoalRank) => {
  const getResponse = await getCurrentBid();
  const currentBid = getResponse.bidAmt;
  let putResponse;
  console.log('Bid Amount Plus TEST ===>> ', currentBid + 30);
  if (adRankNum > adGoalRank) {
    putResponse = await updateKeywordBid(currentBid + 30);
  } else if (adRankNum < adGoalRank) {
    putResponse = await updateKeywordBid(currentBid - 30);
  } else {
    console.log('ERROR ::: adjustBidAmt error with value of adRankNum');
    return 0;
  }
  const updatedBid = putResponse.bidAmt;
  console.log('\n!!!! Bid Amount is UPDATED to ', updatedBid);
}

module.exports = { updateBidAmtFunc };