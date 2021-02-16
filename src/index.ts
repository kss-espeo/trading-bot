import TradingBot from "./TradingBot";
import RandomTradingBot from "./RandomTradingBot";
import DeversefiHttpClient from "./DeversefiHttpClient";

const bigdecimal = require("bigdecimal");

let balance = {
  ETH: new bigdecimal.BigDecimal('10'),
  USD: new bigdecimal.BigDecimal('2000')
};

const delayMs = 5000;
const bot: TradingBot = new RandomTradingBot(new DeversefiHttpClient());

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
