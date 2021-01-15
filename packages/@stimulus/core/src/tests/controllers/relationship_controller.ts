import { Controller } from "../../controller"

class BaseItemsController extends Controller {
    static children = ["item"]

    itemChildren!: ItemController[]
    itemChild!: ItemController
}

export class ItemsController extends BaseItemsController {
    static siblings = ["configuration"]
    static children = ["statusBox"]

    siblingBeforeCallbackInvoked = false
    siblingAfterCallbackInvoked = false

    configurationSibling!: ConfigurationController

    statusBoxChildren!: StatusBoxController[]
    statusBoxChild!: StatusBoxController

    beforeItemChildRegistration(controller: ItemController) {
        controller.parentBeforeCallbackInvoked = true
    }

    afterItemChildRegistration(controller: ItemController) {
        controller.parentAfterCallbackInvoked = true
    }

    beforeConfigurationSiblingRegistration(controller: ConfigurationController) {
        controller.siblingBeforeCallbackInvoked = true
    }

    afterConfigurationSiblingRegistration(controller: ConfigurationController) {
        controller.siblingAfterCallbackInvoked = true
    }
}

export class ConfigurationController extends Controller {
    static siblings = ["items"]

    siblingBeforeCallbackInvoked = false
    siblingAfterCallbackInvoked = false

    itemsSibling!: ItemsController

    beforeItemsSiblingRegistration(controller: ItemsController) {
        controller.siblingBeforeCallbackInvoked = true
    }

    afterItemsSiblingRegistration(controller: ItemsController) {
        controller.siblingAfterCallbackInvoked = true
    }
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
