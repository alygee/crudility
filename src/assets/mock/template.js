const template = {
  description: 'Кошелек',
  type: 'object',
  required: [],
  properties: {
    balance: {
      format: '',
      title: '"Баланс"',
      type: 'number'
    },
    balance_last_update_tx_id: {
      format: '',
      title: 'balance_last_update_tx_id',
      type: 'number'
    },
    contractor: {
      oneOf: [{
        const: '1',
        title: 'description'
      }, {
        const: '1',
        title: 'description'
      }, {
        const: '1',
        title: 'description'
      }],
      title: 'contractor',
      type: 'string'
    },
    currency_id: {
      oneOf: [{
        const: 'RUB',
        title: 'description'
      }, {
        const: 'USD',
        title: 'description'
      }, {
        const: 'EUR',
        title: 'description'
      }],
      title: 'Валюта',
      type: 'string'
    },
    description: {
      format: '',
      title: 'description',
      type: 'string'
    },
    direction: {
      enum: ['debit', 'credit'],
      title: 'direction',
      type: 'string'
    },
    id: {
      disabled: true,
      title: 'id',
      type: 'string'
    },
    status: {
      enum: ['active'],
      title: 'status',
      type: 'string'
    },
    type: {
      enum: ['hold', 'client', 'system'],
      title: 'type',
      type: 'string'
    }
  }
}

export default template
