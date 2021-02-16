import axios from 'axios';
import BestPrice from "./types/BestPrice";

class DeversefiHttpClient {
  async ticker(symbol: string): Promise<BestPrice> {

    const url = `https://api.stg.deversifi.com/market-data/ticker/${symbol}`;

    const response = await axios.get(url, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });
    return {bid: response.data[0], ask: response.data[2]};
  }
}

export default DeversefiHttpClient;