import { Controller } from "../../controller"

class BaseItemsController extends Controller {
    static children = ["item"]

    itemChildren!: ItemController[]
    itemChild!: ItemController
}

export class ItemsController extends BaseItemsController {
    static children = ["statusBox"]

    statusBoxChildren!: StatusBoxController[]
    statusBoxChild!: StatusBoxController

    beforeItemChildRegistration(controller: ItemController) {
        controller.parentBeforeCallbackInvoked = true
    }

    afterItemChildRegistration(controller: ItemController) {
        controller.parentAfterCallbackInvoked = true
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
