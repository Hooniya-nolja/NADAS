const { getCurrentBid, updateKeywordBid } = require('./adkeywordAPI.js');

const updateBidAmtFunc = async (adRankNum, adGoalRank, bidMax) => {
  const getResponse = await getCurrentBid();
  const currentBid = getResponse.bidAmt;
  let putResponse;
  if (adRankNum > adGoalRank) {
    if (currentBid+100 > bidMax) {
      console.log('[BID MAXIMUM] Cannot increase bid  ===>  currentBid:',currentBid,' bidMax:', bidMax, '\n');
      console.log('\n!!!! current ranking: ', adRankNum, ' / goal ranking: ', adGoalRank);
      return 0;
    } else {
      putResponse = await updateKeywordBid(currentBid + 100);
    }
  } else if (adRankNum < adGoalRank) {
    putResponse = await updateKeywordBid(currentBid - 100);
  } else {
    console.log('ERROR ::: adjustBidAmt error with value of adRankNum');
    return 0;
  }
  const updatedBid = putResponse.bidAmt;
  console.log('\n!!!! current ranking: ', adRankNum, ' / goal ranking: ', adGoalRank);
  console.log('\n!!!! Bid Amount is UPDATED to ', updatedBid);
}

module.exports = { updateBidAmtFunc };