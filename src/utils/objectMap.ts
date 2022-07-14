export function objectMap(object, mapFn: (obj) => any) {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapFn(object[key])
    return result
  }, {})
}
