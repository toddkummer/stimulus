import { Controller } from "./controller";
import { Scope } from "./scope";
import { camelize } from "./string_helpers";

export class ChildrenMap {
    readonly scope: Scope
    private childrenByName: Map<string, Controller[]>

    constructor(scope: Scope) {
        this.scope = scope
        this.childrenByName = new Map
    }

    addChild(controller: Controller) {
        const name = camelize(controller.identifier)
        if(!this.childrenByName.has(name)) {
            this.childrenByName.set(name, [])
        }
        this.get(name).push(controller)
    }

    get(name: string): Controller[] {
        return this.childrenByName.get(name) || []
    }
}
