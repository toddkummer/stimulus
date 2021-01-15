import { Controller } from "./controller";
import { Scope } from "./scope";

export class RelationsMap {
    readonly scope: Scope
    private childrenByName: Map<string, Controller[]>

    constructor(scope: Scope) {
        this.scope = scope
        this.childrenByName = new Map
    }

    addChild(name: string, controller: Controller) {
        if(!this.childrenByName.has(name)) {
            this.childrenByName.set(name, [])
        }
        this.get(name).push(controller)
    }

    get(name: string): Controller[] {
        return this.childrenByName.get(name) || []
    }
}
