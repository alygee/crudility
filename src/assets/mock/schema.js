import entities from './entities'

export default {
  schema: {
    enums: [
      { 'name': 'wallet_type', 'title': 'Тип кошелька' },
      { 'name': 'wallet_direction', 'title': null },
      { 'name': 'wallet_status', 'title': null }
    ],
    entities
  }
}
