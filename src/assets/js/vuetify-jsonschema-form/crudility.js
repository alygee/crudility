// Some util functions around select components preparation to reduce size of the Property component
/* eslint-disable */

import DisplayTemplate from '../DisplayTemplate'

const crudilityUtils = {}
export default crudilityUtils

crudilityUtils.transformItemsForAutocomplete = (selectItems, displayTemplate) => {
  const dTemplate = new DisplayTemplate(displayTemplate)
  return selectItems.map((item) => {
    return {
      const: Object.values(item.identity)[0],
      title: dTemplate.generate(item.data)
    }
  })
}

crudilityUtils.isItemsLoadedFromQuery = (fullSchema, rawSelectItems) => {
  return fullSchema.entityName && rawSelectItems && Array.isArray(rawSelectItems) && rawSelectItems.length && rawSelectItems[0].identity
}

crudilityUtils.IsFilled = (q) => {
  return q && q.split()
}

crudilityUtils.buildQueryConditions = (entitySchema, q, entityName) => {
  let query = ''
  const entity = entitySchema.entities.find(en => en.name === entityName)
  entity.fields.map(field => {
    if (['string', 'text'].includes(field.type)) {
      query += `${field.name} ~ ${q} OR `
    } else if (['int', 'long'].includes(field.type) && !isNaN(Number(q))) {
      query += `${field.name} = ${Number(q)} OR `
    }
  })
  return query
}

crudilityUtils.addCurrentItem = (modelWrapper, modelKey, selectItems, itemKey, data) => {
  const model = modelWrapper[modelKey]
  if (!model) return
  const identityKey = Object.keys(selectItems[0].identity)[0]
  const currentItem = selectItems.find(item => item.identity[identityKey] === model)
  if (!currentItem) {
    const newItem = {
      data: data[modelKey],
      identity: { [identityKey]: model}
    }
    selectItems.push(newItem)
  }
}