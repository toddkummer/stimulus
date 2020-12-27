import { Action } from "./action";
import { ActionDescriptor } from "./action_descriptor";
import { Binding } from "./binding";
import { Context } from "./context";
import { Dispatcher } from "./dispatcher";
import { Relationships } from "./relationships";

export class ParentChildConnector {
    readonly context: Context
    private dispatcher: Dispatcher
    private childBinding?: Binding

    constructor(context: Context, dispatcher: Dispatcher) {
        this.context = context
        this.dispatcher = dispatcher
    }

    start() {
        if (this.childIdentifiers.length > 0) {
            this.connectChildConnectHandler()
        }

        if (this.parentIdentifier) {
            this.dispatchChildConnectEvent()
        }
    }

    stop() {
        if (this.childBinding) {
            this.disconnectChildConnectHandler()
        }
    }

    private connectChildConnectHandler() {
        const binding = new Binding(this.context, this.childConnectAction)
        this.childBinding = binding
        this.dispatcher.bindingConnected(binding)
    }

    private disconnectChildConnectHandler() {
        const binding = this.childBinding
        if (binding) {
            this.childBinding = undefined
            this.dispatcher.bindingDisconnected(binding)
        }
    }

    private get childConnectAction(): Action {
        const actionDescriptor =  {
            eventTarget: this.context.element,
            eventOptions: {},
            eventName: 'connect',
            identifier: this.context.identifier,
            methodName: 'handleChildConnectEvent'
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
        const info = { controller: this.context.controller, parentIdentifier: this.parentIdentifier }
        this.context.element.dispatchEvent(
            new CustomEvent('connect', { bubbles: true, detail: info })
        )
    }
}
