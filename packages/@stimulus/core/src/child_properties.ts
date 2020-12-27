import { Constructor } from "./constructor"
import { Controller } from "./controller"
import { readInheritableStaticArrayValues } from "./inheritable_statics"

/** @hidden */
export function ChildPropertiesBlessing<T>(constructor: Constructor<T>) {
  const children = readInheritableStaticArrayValues(constructor, "children")
  return children.reduce((properties, childDefinition) => {
    return Object.assign(properties, propertiesForChildDefinition(childDefinition))
  }, { declaredChildren: children } as PropertyDescriptorMap)
}

function propertiesForChildDefinition(name: string) {
  return {
    [`${name}Child`]: {
      get(this: Controller) {
        const children = this.children.get(name)
        if (children) {
          return children[0]
        } else {
          throw new Error(`Missing children "${name}" for "${this.identifier}" controller`)
        }
      }
    },

    [`${name}Children`]: {
      get(this: Controller) {
        return this.children.get(name)
      }
    }
  }
}
