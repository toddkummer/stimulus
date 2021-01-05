import { Controller } from "./controller";

export function withControllerRegistrationCallbacks(controller: Controller, name: String, registeredController: Controller, func: () => void) {
  conditionalCall(controller, `before${name}`, registeredController)
  func()
  conditionalCall(controller, `after${name}`, registeredController)
}

function conditionalCall(controller: Controller, callback: string, registeredController: Controller) {
  if (callback in controller) {
    // @ts-ignore
    controller[callback](registeredController)
  }
}
