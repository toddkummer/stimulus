import { Controller } from "./controller";
import { Scope } from "./scope";

export class RelationsMap {
    readonly scope: Scope
    private readonly childrenByName: Map<string, Controller[]>
    private readonly siblingsByName: Map<string, Controller[]>

    constructor(scope: Scope) {
        this.scope = scope
        this.childrenByName = new Map
        this.siblingsByName = new Map
    }

    addChild(name: string, controller: Controller) {
        this.add(this.childrenByName, name, controller)
    }

    getChildren(name: string): Controller[] {
        return this.childrenByName.get(name) || []
    }

    addSibling(name: string, controller: Controller) {
        this.add(this.siblingsByName, name, controller)
    }

    getSiblings(name: string): Controller[] {
        return this.siblingsByName.get(name) || []
    }

    private add(map: Map<string, Controller[]>, name: string, controller: Controller) {
        const controllers = map.get(name) || []
        if (!map.has(name)) {
            map.set(name, controllers)
        }
        controllers.push(controller)
    }
}
