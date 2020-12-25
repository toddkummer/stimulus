import { ControllerTestCase } from "../cases/controller_test_case"
import {ItemsController, ItemController, StatusBoxController} from "../controllers/parent_controller"

export default class ParentChildTests extends ControllerTestCase() {
  setupApplication() {
    this.application.register('status-box', StatusBoxController)
    this.application.register('item', ItemController)
    this.application.register('items', ItemsController)
  }

  get parentController(): ItemsController {
    const controller = this.controllers.find(controller => controller.identifier === 'items')
    if (controller) {
      return controller as ItemsController
    } else {
      throw new Error("no parent controller connected")
    }
  }

  get childItemControllers(): ItemController[] {
    return this.controllers.filter(controller => controller.identifier === 'item') as ItemController[]
  }

  get childStatusBoxController(): StatusBoxController {
    const controller = this.controllers.find(controller => controller.identifier === 'status-box')
    if (controller) {
      return controller as StatusBoxController
    } else {
      throw new Error("no status box controller connected")
    }
  }

  fixtureHTML = `
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
    const childControllers = this.childItemControllers.concat([this.childStatusBoxController])
    childControllers.forEach(childController => {
      this.assert.equal(this.parentController, childController.parent)
    })
  }
}
