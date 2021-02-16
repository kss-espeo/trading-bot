import TradingBot from "./TradingBot";
import RandomTradingBot from "./RandomTradingBot";
// import SimpleTradingBot from "./SimpleTradingBot";

const bigdecimal = require("bigdecimal");

let balance = {
  ETH: new bigdecimal.BigDecimal('10'),
  USD: new bigdecimal.BigDecimal('2000')
};

const delayMs = 5000;
const bot: TradingBot = new RandomTradingBot();

(async () => {
  let delayTicks = 0;
  while (true) {
    await bot.trade(balance);

    console.log('__________________________________\n');
    await delay(delayMs);
    if (++delayTicks == 5) {
      console.log(`ETH balance: ${balance.ETH} , USD balance: ${balance.USD}`);
      delayTicks = 0;
    }
  }
})();

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
