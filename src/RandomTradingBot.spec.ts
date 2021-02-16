import {afterEach, beforeEach, describe, it} from 'mocha';
import * as sinon from 'sinon';
import RandomTradingBot from "./RandomTradingBot";
import {OrderType} from "./types/Order";
import DeversefiHttpClient from "./DeversefiHttpClient";

const bigdecimal = require("bigdecimal");

const {expect} = require('chai').use(require('dirty-chai'));

describe('RandomTradingBot', () => {
  const SOME_BID = 200;
  const SOME_ASK = 300;
  const SOME_BALANCE = {
    ETH: new bigdecimal.BigDecimal('100'),
    USD: new bigdecimal.BigDecimal('10000')
  };

  let sut;
  let deversefiApiMock = new DeversefiHttpClient();

  beforeEach(() => {
    sut = new RandomTradingBot(deversefiApiMock);
  });


  afterEach(() => {
    deversefiApiMock = new DeversefiHttpClient();
  });

  it('should add bid/ask orders within 5% of best bid/ask price', () => {
    // given
    sinon.stub(deversefiApiMock, "ticker").returns(Promise.resolve({bid: SOME_BID, ask: SOME_ASK}));
    // when
    sut.trade(SOME_BALANCE);
    sut.trade(SOME_BALANCE);
    sut.trade(SOME_BALANCE);
    // then
    (sut as any).orders.filter(order => order.type == OrderType.BID).forEach(bid => {
      expect(bid.price).to.be.above(SOME_BID * 0.95);
      expect(bid.price).to.be.below(SOME_BID * 1.05);
    });
    (sut as any).orders.filter(order => order.type == OrderType.ASK).forEach(ask => {
      expect(ask.price).to.be.above(SOME_ASK * 0.95);
      expect(ask.price).to.be.below(SOME_ASK * 1.05);
    });
  });
});