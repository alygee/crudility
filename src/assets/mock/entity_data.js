export default {
  data: {
    amount: 99,
    created: '2019-10-02T12:12:10.046717Z',
    currency_id: {
      code_alpha: 'RUB',
      code_numeric: '643'
    },
    currency_id$meta: {
      query: 'currency:'
    },
    currency_id$value: 'RUB',
    id: 12429667368697866,
    idempotency_key: 'nBKMkPoJGy',
    payment_id: '1570008508911',
    transaction_id$meta: {
      query: 'transaction:'
    },
    type: 'hold',
    wallet_from_id: {
      balance: '1',
      balance_last_update_tx_id: '12429667368697866',
      currency_id: 'RUB',
      description: null,
      direction: 'credit',
      id: '15',
      status: 'active',
      type: 'client'
    },
    wallet_from_id$meta: {
      query: 'wallet:'
    },
    wallet_from_id$value: 15,
    wallet_to_id: {
      balance: '1009070',
      balance_last_update_tx_id: '13152097330003978',
      currency_id: 'RUB',
      description: null,
      direction: 'credit',
      id: '4',
      status: 'active',
      type: 'hold'
    },
    wallet_to_id$meta: {
      query: 'wallet:'
    },
    wallet_to_id$value: '4'
  },
  identity: {
    id: '12429667368697866'
  }
}
