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
}

export class ItemController extends Controller {
    static parent = "items"

    parent!: ItemsController
}

class BaseStatusBoxController extends Controller {
    static parent = "items"

    parent!: ItemsController
}

export class StatusBoxController extends BaseStatusBoxController {
}
