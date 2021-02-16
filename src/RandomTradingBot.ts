import TradingBot from "./TradingBot";
import DeversefiHttpClient from "./DeversefiHttpClient";
import {Order, OrderType} from "./types/Order";
import BestPrice from "./types/BestPrice";

const bigdecimal = require("bigdecimal");

class RandomTradingBot implements TradingBot {
  private deversefiApiClient = new DeversefiHttpClient();

  private orders: Order[] = [];

  async trade(balance: { ETH, USD }): Promise<void> {
    const bestPrices = await this.deversefiApiClient.ticker('ETH:USDT');

    this.orders = [...this.orders, ...this.generateRandomOrders(bestPrices)];

    this.resolveOrders(bestPrices, balance);
    if (this.orders.length > 1000) {
      this.orders = [];
    }
  }

  private generateRandomOrders(bestPrices: BestPrice): Order[] {
    const result = [];

    for (let i = 0; i < 5; i++) {
      const bid = {amount: Math.random(), price: bestPrices.bid + bestPrices.bid * this.betweenMinusFivePercentAndPlusFivePercent(), type: OrderType.BID};
      const ask = {amount: Math.random(), price: bestPrices.ask + bestPrices.ask * this.betweenMinusFivePercentAndPlusFivePercent(), type: OrderType.ASK};
      result.push(bid);
      console.log(`PLACE BID @ PRICE: ${bid.price} AMOUNT: ${bid.amount}`);
      result.push(ask);
      console.log(`PLACE ASK @ PRICE: ${ask.price} AMOUNT: ${ask.amount}`);
    }

    return result;
  }

  private betweenMinusFivePercentAndPlusFivePercent() {
    return 0.05 - Math.random() / 10;
  }

  private resolveOrders(bestPrices: BestPrice, balance: { ETH, USD }) {
    this.orders.filter(order => order.type == OrderType.BID && order.price > bestPrices.bid).forEach(bid => {
      const preciseEthAmount = new bigdecimal.BigDecimal(bid.amount);
      const preciseUsdAmount = preciseEthAmount.multiply(new bigdecimal.BigDecimal(bid.price));

      if (balance.USD.compareTo(preciseUsdAmount) != -1) {
        balance.ETH = balance.ETH.add(preciseEthAmount);
        balance.USD = balance.USD.subtract(preciseUsdAmount);
        this.orders.splice(this.orders.indexOf(bid), 1);
        console.log(`FILLED BID @ PRICE: ${bid.price} AMOUNT: ${bid.amount} (ETH + ${preciseEthAmount} USD - ${preciseUsdAmount})`);
      }
    });

    this.orders.filter(order => order.type == OrderType.ASK && order.price < bestPrices.ask).forEach(ask => {
      const preciseEthAmount = new bigdecimal.BigDecimal(ask.amount);
      const preciseUsdAmount = preciseEthAmount.multiply(new bigdecimal.BigDecimal(ask.price));

      if (balance.ETH.compareTo(preciseEthAmount) != -1) {
        balance.ETH = balance.ETH.subtract(preciseEthAmount);
        balance.USD = balance.USD.add(preciseUsdAmount);
        this.orders.splice(this.orders.indexOf(ask), 1);
        console.log(`FILLED ASK @ PRICE: ${ask.price} AMOUNT: ${ask.amount} (ETH - ${preciseEthAmount} USD + ${preciseUsdAmount})`);
      }
    });
  }
}

export default RandomTradingBot;