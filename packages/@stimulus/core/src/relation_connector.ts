import { Action } from "./action";
import { ActionDescriptor } from "./action_descriptor";
import { Binding } from "./binding";
import { Context } from "./context";
import { Dispatcher } from "./dispatcher";
import { Relationships } from "./relationships";

export class RelationConnector {
    readonly context: Context
    private dispatcher: Dispatcher
    private childBinding?: Binding
    private siblingBinding?: Binding

    constructor(context: Context, dispatcher: Dispatcher) {
        this.context = context
        this.dispatcher = dispatcher
    }

    start() {
        if (this.childIdentifiers.length > 0) {
            this.childBinding = this.bindConnectHandler(this.context.element)
        }

        if (this.siblingIdentifiers.length > 0) {
            this.siblingBinding = this.bindConnectHandler(this.context.application.element)

            this.siblingIdentifiers.forEach(sibling => {
                this.dispatchSiblingConnectEvent(sibling)
            })
        }

        if (this.parentIdentifier) {
            this.dispatchChildConnectEvent()
        }
    }

    stop() {
        this.disconnectChildConnectHandler()
        this.disconnectSiblingConnectHandler()
    }

    private bindConnectHandler(element: Element): Binding {
        const binding = new Binding(this.context, this.relationConnectAction(element))
        this.dispatcher.bindingConnected(binding)
        return binding
    }

    private disconnectChildConnectHandler() {
        const binding = this.childBinding
        if (binding) {
            this.childBinding = undefined
            this.dispatcher.bindingDisconnected(binding)
        }
    }

    private disconnectSiblingConnectHandler() {
        const binding = this.siblingBinding
        if (binding) {
            this.siblingBinding = undefined
            this.dispatcher.bindingDisconnected(binding)
        }
    }

    private relationConnectAction(eventTarget: EventTarget): Action {
        const actionDescriptor =  {
            eventTarget: eventTarget,
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

    private get siblingIdentifiers(): string[] {
        return this.relationships.siblingIdentifiers
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

    private dispatchSiblingConnectEvent(name: string) {
        const info = { controller: this.context.controller, connectAs: 'sibling', targetIdentifier: name }
        this.context.element.dispatchEvent(
            new CustomEvent('connect', { bubbles: true, detail: info })
        )
    }
}
