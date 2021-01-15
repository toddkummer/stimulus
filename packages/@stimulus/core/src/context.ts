import { Application } from "./application"
import { BindingObserver } from "./binding_observer"
import { Controller } from "./controller"
import { Dispatcher } from "./dispatcher"
import { ErrorHandler } from "./error_handler"
import { Module } from "./module"
import { Schema } from "./schema"
import { Scope } from "./scope"
import { ValueObserver } from "./value_observer"
import { RelationConnector } from "./relation_connector";
import { withControllerRegistrationCallbacks } from "./controller_callbacks";
import {camelize, capitalize} from "./string_helpers";

export class Context implements ErrorHandler {
  readonly module: Module
  readonly scope: Scope
  readonly controller: Controller
  private bindingObserver: BindingObserver
  private valueObserver: ValueObserver
  private relationConnector: RelationConnector

  constructor(module: Module, scope: Scope) {
    this.module = module
    this.scope = scope
    this.controller = new module.controllerConstructor(this)
    this.bindingObserver = new BindingObserver(this, this.dispatcher)
    this.valueObserver = new ValueObserver(this, this.controller)
    this.relationConnector = new RelationConnector(this, this.dispatcher)

    try {
      this.controller.initialize()
    } catch (error) {
      this.handleError(error, "initializing controller")
    }
  }

  connect() {
    this.bindingObserver.start()
    this.valueObserver.start()
    this.relationConnector.start()

    try {
      this.controller.connect()
    } catch (error) {
      this.handleError(error, "connecting controller")
    }
  }

  disconnect() {
    try {
      this.controller.disconnect()
    } catch (error) {
      this.handleError(error, "disconnecting controller")
    }

    this.valueObserver.stop()
    this.bindingObserver.stop()
    this.relationConnector.stop()
  }

  register(relationship: string, controller: Controller) {
    if (relationship === "child") {
      this.registerChild(controller)
    } else if (relationship === "sibling") {
      this.registerSibling(controller)
    }
  }

  get application(): Application {
    return this.module.application
  }

  get identifier(): string {
    return this.module.identifier
  }

  get schema(): Schema {
    return this.application.schema
  }

  get dispatcher(): Dispatcher {
    return this.application.dispatcher
  }

  get element(): Element {
    return this.scope.element
  }

  get parentElement(): Element | null {
    return this.element.parentElement
  }

  // Error handling

  handleError(error: Error, message: string, detail: object = {}) {
    const { identifier, controller, element } = this
    detail = Object.assign({ identifier, controller, element }, detail)
    this.application.handleError(error, `Error ${message}`, detail)
  }

  private registerChild(controller: Controller) {
    const name = camelize(controller.identifier)

    withControllerRegistrationCallbacks(this.controller,
        `${capitalize(name)}ChildRegistration`,
        controller,
        () => { this.scope.relations.addChild(name, controller) })
    withControllerRegistrationCallbacks(controller,
        'ParentRegistration',
        this.controller,
        () => controller.parent = this.controller)
  }

  private registerSibling(controller: Controller) {
    const name = camelize(controller.identifier)
    const callbackName = `${capitalize(name)}SiblingRegistration`

    withControllerRegistrationCallbacks(this.controller, callbackName, controller,
        () => { this.controller.relations.addSibling(name, controller) })

    const nameOnSibling = camelize(this.controller.identifier)
    const callbackNameOnSibling = `${capitalize(nameOnSibling)}SiblingRegistration`
    withControllerRegistrationCallbacks(controller, callbackNameOnSibling, this.controller,
        () => controller.relations.addSibling(nameOnSibling, this.controller))
  }
}
