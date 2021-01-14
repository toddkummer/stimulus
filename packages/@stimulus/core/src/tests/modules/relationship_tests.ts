import { ControllerTestCase } from "../cases/controller_test_case"
import { ItemsController, ItemController, StatusBoxController, ConfigurationController } from "../controllers/relationship_controller"
import { Controller } from "../../controller";

export default class RelationshipTests extends ControllerTestCase() {
  setupApplication() {
    this.application.register('status-box', StatusBoxController)
    this.application.register('item', ItemController)
    this.application.register('items', ItemsController)
  }

  getControllerByName(identifier: string) {
    const controller = this.controllers.find(controller => controller.identifier === identifier)
    if (controller) {
      return controller as Controller
    } else {
      throw new Error(`no ${identifier} controller connected`)
    }
  }

  get parentController(): ItemsController {
    return this.getControllerByName('items') as ItemsController
  }

  get itemsController(): ItemsController {
    return this.parentController
  }

  get childItemControllers(): ItemController[] {
    return this.controllers.filter(controller => controller.identifier === 'item') as ItemController[]
  }

  get childStatusBoxController(): StatusBoxController {
    return this.getControllerByName('status-box') as StatusBoxController
  }

  get childControllers(): Controller[] {
    return this.controllers.filter(controller => controller.identifier != 'items') as Controller[]
  }

  get configurationController(): ConfigurationController {
    return this.getControllerByName('configuration') as ConfigurationController
  }

  fixtureHTML = `
    <div data-controller="configuration"></div>
    <div data-controller="items">
      <div data-controller="status-box"></div>
      <div data-controller="item"></div>
      <div data-controller="item"></div>
    </div>
  `

  "test parent identifier assigned to module for child (item) controller"() {
    const module = this.application.router.modules.find(module => { return module.definition.identifier === 'item' })
    this.assert.equal(module && module.relationships.parentIdentifier, 'items')
  }

  "test parent identifier assigned to module for child (status-box) controller"() {
    const module = this.application.router.modules.find(module => { return module.definition.identifier === 'status-box' })
    this.assert.equal(module && module.relationships.parentIdentifier, 'items')
  }

  "test child identifier (item) assigned to module for parent controller"() {
    const module = this.application.router.modules.find(module => { return module.definition.identifier === 'items' })
    this.assert.ok(module && module.relationships.childIdentifiers.includes('item'))
  }

  "test child identifier (status-box) assigned to module for parent controller"() {
    const module = this.application.router.modules.find(module => { return module.definition.identifier === 'items' })
    this.assert.ok(module && module.relationships.childIdentifiers.includes('status-box'))
  }

  "test children (item) available via parent controller property"() {
    this.assert.deepEqual(this.childItemControllers, this.parentController.itemChildren)
  }

  "test children (status-box) available via parent controller property"() {
    this.assert.deepEqual([this.childStatusBoxController], this.parentController.statusBoxChildren)
  }

  "test a child (item) available via parent controller property"() {
    this.assert.equal(this.parentController.itemChild.identifier, 'item')
  }

  "test the single child (status-box) available via parent controller property"() {
    this.assert.equal(this.childStatusBoxController, this.parentController.statusBoxChild)
  }

  "test each child controller assigned its parent"() {
    this.childControllers.forEach(childController => {
      this.assert.equal(this.parentController, childController.parent)
    })
  }

  "test before callback invoked for parent registration with parent as param"() {
    const parent = this.parentController
    this.childItemControllers.forEach(controller => {
      this.assert.equal(controller.beforeParameter, parent)
    })
  }

  "test after callback invoked for parent registration with parent as param"() {
    const parent = this.parentController
    this.childItemControllers.forEach(controller => {
      this.assert.equal(controller.afterParameter, parent)
    })
  }

  "test before callback invoked for child registration"() {
    this.childItemControllers.forEach(controller => {
      this.assert.ok(controller.parentBeforeCallbackInvoked)
    })
  }

  "test after callback invoked for item child"() {
    this.childItemControllers.forEach(controller => {
      this.assert.ok(controller.parentAfterCallbackInvoked)
    })
  }

  "test configuration controller available in items controller"() {
    this.assert.equal(this.itemsController.configurationController, this.configurationController)
  }

  "test items controller available in configuration controller"() {
    this.assert.equal(this.configurationController.itemsController, this.itemsController)
  }

  "test before callback invoked for sibling registration"() {
    this.assert.ok(this.configurationController.siblingBeforeCallbackInvoked)
  }

  "test after callback invoked for sibling registration"() {
    this.assert.ok(this.configurationController.siblingAfterCallbackInvoked)
  }
}
