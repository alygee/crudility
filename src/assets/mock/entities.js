const currency = {
  fields: [
    { name: 'code_alpha', title: null, type: 'string' },
    { name: 'code_numeric', title: null, type: 'int' }
  ],
  fk: [],
  revFk: [{ name: 'wallets', targetEntity: 'wallet', title: 'Кошелёк', type: 'ToMany' }],
  medLnk: [],
  name: 'currency',
  title: 'Валюта'
}

const contractor = {
  fields: [
    { name: 'id', title: null, type: 'long' },
    { name: 'slug', title: null, type: 'text' },
    { name: 'description', title: null, type: 'text' },
    { name: 'contract', title: null, type: 'text' }
  ],
  fk: [],
  medLnk: [{ name: 'wallets', targetEntity: 'wallet', title: null, type: '' }],
  name: 'contractor',
  title: null
}

const wallet = {
  fields: [
    { name: 'id', title: null, type: 'long' },
    { name: 'balance', title: 'Баланс', type: 'long' },
    { name: 'balance_last_update_tx_id', title: null, type: 'long' },
    { name: 'type', title: null, type: 'wallet_type' },
    { name: 'direction', title: null, type: 'wallet_direction' },
    { name: 'status', title: null, type: 'wallet_status' },
    { name: 'description', title: null, type: 'text' }
  ],
  fk: [{ name: 'currency_id', targetEntity: 'currency', title: null, type: 'ToOne' }],
  medLnk: [{ name: 'contractor', targetEntity: 'contractor', title: null, type: 'ToOne' }],
  revFk: [],
  name: 'wallet',
  title: 'Кошелёк'
}

const contractorWallets = {
  fields: [],
  fk: [
    { name: 'wallet_id', title: null, targetEntity: 'wallet', type: 'ToOne' },
    { name: 'contractor_id', title: null, targetEntity: 'contractor', type: 'ToOne' },
    { name: 'currency_id', title: null, targetEntity: 'currency', type: 'ToOne' }
  ],
  medLnk: [],
  name: 'contractor_wallets',
  revFk: [],
  title: null
}

const transaction = {
  fields: [
    { name: 'id', title: null, type: 'long' },
    { name: 'payment_id', title: null, type: 'string' },
    { name: 'idempotency_key', title: null, type: 'string' },
    { name: 'created', title: null, type: 'timestamp' },
    { name: 'amount', title: null, type: 'int' },
    { name: 'meta_data', title: null, type: 'text' },
    { name: 'type', title: null, type: 'transaction_type' },
    { name: 'details', title: null, type: 'text' }
  ],
  fk: [
    { name: 'currency_id', title: null, targetEntity: 'currency', type: 'ToOne' },
    { name: 'wallet_from_id', title: null, targetEntity: 'wallet', type: 'ToOne' },
    { name: 'wallet_to_id', title: null, targetEntity: 'wallet', type: 'ToOne' },
    { name: 'transaction_id', title: null, targetEntity: 'transaction', type: 'ToOne' }
  ],
  medLnk: [],
  name: 'transaction',
  revFk: [],
  title: null
}

const account = {
  fields: [
    { description: null, generated: true, name: 'id', required: true, title: null, type: 'long' },
    { description: null, generated: false, name: 'account_id', required: true, title: null, type: 'long' },
    { description: null, generated: false, name: 'account_number', required: true, title: null, type: 'string' },
    { description: null, generated: false, name: 'wallet_id', required: false, title: null, type: 'long' },
    { description: 'Field contain dates range in which account is active', generated: false, name: 'effective_range', required: true, title: null, type: 'timerange' }
  ],
  fk: [{ description: null, displayTemplate: null, name: 'currency_id', required: true, targetEntity: 'currency', title: null, type: 'ToOne' }],
  medLnk: [],
  revFk: [],
  name: 'account',
  title: null
}

export default [ currency, contractor, wallet, contractorWallets, transaction, account ]
