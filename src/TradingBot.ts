export default interface TradingBot {
  trade(balance: {ETH, USD}): Promise<void>;
}