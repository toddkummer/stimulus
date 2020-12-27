import { dasherize } from "./string_helpers";
import { readInheritableStaticArrayValues, readInheritableStaticValue } from "./inheritable_statics";

export interface Relationships {
    parentIdentifier: string
    childIdentifiers: string[]
}

/** @hidden */
export function buildRelationships(constructor: any): Relationships {
    const parentIdentifier = dasherize(readInheritableStaticValue(constructor, "parent"))
    const childIdentifiers = readInheritableStaticArrayValues(constructor, "children").map(name => dasherize(name))

    return { parentIdentifier, childIdentifiers }
}
