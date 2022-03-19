export function setValue(component, traitName, newValue) {
    const trait = component.getTrait(traitName)
    //const traitOptions = [{value: newValue}]
    //trait.set('options', [...trait.get('options'), ...traitOptions])
    trait.set('value', newValue)
} 