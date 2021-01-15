import { Action } from "./action";
import { ActionDescriptor } from "./action_descriptor";
import { Binding } from "./binding";
import { Context } from "./context";
import { Dispatcher } from "./dispatcher";
import { Relationships } from "./relationships";

export class RelationConnector {
    readonly context: Context
    private dispatcher: Dispatcher
    private relationBinding?: Binding

    constructor(context: Context, dispatcher: Dispatcher) {
        this.context = context
        this.dispatcher = dispatcher
    }

    start() {
        if (this.childIdentifiers.length > 0) {
            this.connectRelationConnectHandler()
        }

        if (this.parentIdentifier) {
            this.dispatchChildConnectEvent()
        }
    }

    stop() {
        if (this.relationBinding) {
            this.disconnectRelationConnectHandler()
        }
    }

    private connectRelationConnectHandler() {
        const binding = new Binding(this.context, this.relationConnectAction)
        this.relationBinding = binding
        this.dispatcher.bindingConnected(binding)
    }

    private disconnectRelationConnectHandler() {
        const binding = this.relationBinding
        if (binding) {
            this.relationBinding = undefined
            this.dispatcher.bindingDisconnected(binding)
        }
    }

    private get relationConnectAction(): Action {
        const actionDescriptor =  {
            eventTarget: this.context.element,
            eventOptions: {},
            eventName: 'connect',
            identifier: this.context.identifier,
            methodName: 'handleRelationConnectEvent'
        } as ActionDescriptor
        return new Action(this.context.element, 0, actionDescriptor)
    }

    private get childIdentifiers(): string[] {
        return this.relationships.childIdentifiers
    }

    private get parentIdentifier(): string {
        return this.relationships.parentIdentifier
    }

    private get relationships(): Relationships {
        return this.context.module.relationships
    }

    private dispatchChildConnectEvent() {
        const info = { controller: this.context.controller, connectAs: 'child', targetIdentifier: this.parentIdentifier }
        this.context.element.dispatchEvent(
            new CustomEvent('connect', { bubbles: true, detail: info })
        )
    }
}
