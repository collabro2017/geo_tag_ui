//@flow
import type { ErrorAction } from "../types"

export const createErrorAction = (
  action: string,
  message: string
): ErrorAction => {
  return { type: action, error: { message } }
}
