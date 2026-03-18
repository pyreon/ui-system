/**
 * Context for nested overlay coordination. When a child overlay opens, it
 * sets the parent's blocked state to true, preventing the parent from
 * closing in response to click/hover events that belong to the child.
 */

import type { VNodeChild } from "@pyreon/core"
import { createContext, onUnmount, popContext, pushContext, useContext } from "@pyreon/core"

export interface OverlayContext {
  blocked: boolean | (() => boolean)
  setBlocked: () => void
  setUnblocked: () => void
}

const context = createContext<OverlayContext>({} as OverlayContext)

export const useOverlayContext = () => useContext(context)

const Component = ({
  children,
  blocked,
  setBlocked,
  setUnblocked,
}: OverlayContext & { children: VNodeChild }) => {
  const ctx = {
    blocked,
    setBlocked,
    setUnblocked,
  }

  pushContext(new Map([[context.id, ctx]]))
  onUnmount(() => popContext())

  return <>{children}</>
}

export default Component
