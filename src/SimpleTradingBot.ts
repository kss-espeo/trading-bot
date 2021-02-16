import TradingBot from "./TradingBot";

const bigdecimal = require("bigdecimal");

class SimpleTradingBot implements TradingBot{

  async trade(balance: {ETH, USD}): Promise<void> {
    balance.ETH = balance.ETH.add(new bigdecimal.BigDecimal('0.01'));
    balance.USD = balance.USD.subtract(new bigdecimal.BigDecimal('1'));
  }
}

export default SimpleTradingBot;