import { dasherize } from "./string_helpers";
import { readInheritableStaticArrayValues, readInheritableStaticValue } from "./inheritable_statics";

enum RelationshipTypes {
    Parent = 'parent',
    Child = 'child',
    Sibling = 'sibling'
}

export class Relationships {
    readonly parentIdentifier: string
    readonly childIdentifiers: string[]
    readonly siblingIdentifiers: string[]


    constructor(parentIdentifier: string, childIdentifiers: string[], siblingIdentifiers: string[]) {
        this.parentIdentifier = parentIdentifier
        this.childIdentifiers = childIdentifiers
        this.siblingIdentifiers = siblingIdentifiers
    }

    related(type: string, identifier: string) {
        if (type === RelationshipTypes.Parent) {
            return this.parentIdentifier === identifier
        } else if (type === RelationshipTypes.Child) {
            return this.childIdentifiers.includes(identifier)
        } else if (type === RelationshipTypes.Sibling) {
            return this.siblingIdentifiers.includes(identifier)
        } else {
            throw `Invalid relationship type: ${type}`
        }
    }
}

/** @hidden */
export function buildRelationships(constructor: any): Relationships {
    const parentIdentifier = dasherize(readInheritableStaticValue(constructor, "parent"))
    const childIdentifiers = readInheritableStaticArrayValues(constructor, "children").map(name => dasherize(name))
    const siblingIdentifiers = readInheritableStaticArrayValues(constructor, "siblings").map(name => dasherize(name))

    return new Relationships(parentIdentifier, childIdentifiers, siblingIdentifiers)
}
