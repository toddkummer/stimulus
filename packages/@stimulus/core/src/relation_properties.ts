import { Constructor } from "./constructor"
import { Controller } from "./controller"
import { readInheritableStaticArrayValues } from "./inheritable_statics"

/** @hidden */
export function RelationPropertiesBlessing<T>(constructor: Constructor<T>) {
  const children = readInheritableStaticArrayValues(constructor, "children")
  const siblings = readInheritableStaticArrayValues(constructor, "siblings")

  return siblings.reduce((properties, name) => {
    return Object.assign(properties, propertyForSiblingDefinition(name))
  }, children.reduce((properties, childDefinition) => {
    return Object.assign(properties, propertiesForChildDefinition(childDefinition))
  }, {} as PropertyDescriptorMap))
}

function propertiesForChildDefinition(name: string) {
  return {
    [`${name}Child`]: {
      get(this: Controller) {
        const children = this.relations.getChildren(name)
        if (children) {
          return children[0]
        } else {
          throw new Error(`Missing children "${name}" for "${this.identifier}" controller`)
        }
      }
    },

    [`${name}Children`]: {
      get(this: Controller) {
        return this.relations.getChildren(name)
      }
    }
  }
}

function propertyForSiblingDefinition(name: string) {
  return {
    [`${name}Sibling`]: {
      get(this: Controller) {
        const siblings = this.relations.getSiblings(name)
        if (siblings) {
          return siblings[0]
        } else {
          throw new Error(`Missing sibling "${name}" for "${this.identifier}" controller`)
        }
      }
    },

    [`${name}Siblings`]: {
      get(this: Controller) {
        return this.relations.getSiblings(name)
      }
    }
  }
}
