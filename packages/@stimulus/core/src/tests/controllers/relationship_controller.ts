import { Controller } from "../../controller"

class BaseItemsController extends Controller {
    static children = ["item"]

    itemChildren!: ItemController[]
    itemChild!: ItemController
}

export class ItemsController extends BaseItemsController {
    static siblings = ["configuration"]
    static children = ["statusBox"]

    configurationController!: ConfigurationController

    statusBoxChildren!: StatusBoxController[]
    statusBoxChild!: StatusBoxController

    beforeItemChildRegistration(controller: ItemController) {
        controller.parentBeforeCallbackInvoked = true
    }

    afterItemChildRegistration(controller: ItemController) {
        controller.parentAfterCallbackInvoked = true
    }

    beforeSiblingRegistration(controller: ConfigurationController) {
        controller.siblingBeforeCallbackInvoked = true
    }

    afterSiblingRegistration(controller: ConfigurationController) {
        controller.siblingAfterCallbackInvoked = true
    }
}

export class ConfigurationController extends Controller {
    static siblings = ["items"]

    siblingBeforeCallbackInvoked = false
    siblingAfterCallbackInvoked = false

    itemsController!: ItemsController
}

export class ItemController extends Controller {
    static parent = "items"

    parentBeforeCallbackInvoked = false
    parentAfterCallbackInvoked = false
    beforeParameter?: Controller
    afterParameter?: Controller

    parent!: ItemsController

    beforeParentRegistration(controller: Controller) {
        this.beforeParameter = controller
    }

    afterParentRegistration(controller: Controller) {
        this.afterParameter = controller
    }
}

class BaseStatusBoxController extends Controller {
    static parent = "items"

    parent!: ItemsController
}

export class StatusBoxController extends BaseStatusBoxController {
}
