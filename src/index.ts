import SimpleTradingBot from "./SimpleTradingBot";
import TradingBot from "./TradingBot";

const bigdecimal = require("bigdecimal");

let BALANCE = {
  ETH: new bigdecimal.BigDecimal('10'),
  USD: new bigdecimal.BigDecimal('2000')
};

const delayMs = 1000;
const bot: TradingBot = new SimpleTradingBot();

(async () => {
  let delayTicks = 0;
  while (true) {
    await bot.trade(BALANCE);

    console.log('.');
    await delay(delayMs);
    if (++delayTicks == 5) {
      console.log(`ETH balance: ${BALANCE.ETH} , USD balance: ${BALANCE.USD}`);
      delayTicks = 0;
    }
  }
})();

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
