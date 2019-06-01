// Define input selector using a string keypath
const getSubtotal = createSelector(
    ['shop.items'],
    items => {
      // return value here
    }
  )
  
  // Define input selectors as a mix of other selectors and string keypaths
  const getTax = createSelector(
    [getSubtotal, 'shop.taxPercent'],
    (subtotal, taxPercent) => {
      // return value here
    }
  )
  
  // Define input selector using a custom argument index to access a prop
  const getTabContent = createSelector(
    [{ path: 'tabIndex', argIndex: 1 }],
    tabIndex => {
      // return value here
    }
  )
  
  const getContents = createSelector({ foo: 'foo', bar: 'nested.bar' })
  // Returns an object like:  {foo, bar}