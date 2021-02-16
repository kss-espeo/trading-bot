interface Order {
  amount: number;
  price: number;
  type: OrderType
}

enum OrderType {
  BID,
  ASK
}

export {Order, OrderType};