import { dasherize } from "./string_helpers";
import { readInheritableStaticArrayValues, readInheritableStaticValue } from "./inheritable_statics";

enum RelationshipTypes {
    Parent = 'parent',
    Child = 'child'
}

export class Relationships {
    readonly parentIdentifier: string
    readonly childIdentifiers: string[]


    constructor(parentIdentifier: string, childIdentifiers: string[]) {
        this.parentIdentifier = parentIdentifier
        this.childIdentifiers = childIdentifiers
    }

    related(type: string, identifier: string) {
        if (type === RelationshipTypes.Parent) {
            return this.parentIdentifier === identifier
        } else if (type === RelationshipTypes.Child) {
            return this.childIdentifiers.includes(identifier)
        } else {
            throw `Invalid relationship type: ${type}`
        }
    }
}

/** @hidden */
export function buildRelationships(constructor: any): Relationships {
    const parentIdentifier = dasherize(readInheritableStaticValue(constructor, "parent"))
    const childIdentifiers = readInheritableStaticArrayValues(constructor, "children").map(name => dasherize(name))

    return new Relationships(parentIdentifier, childIdentifiers)
}
