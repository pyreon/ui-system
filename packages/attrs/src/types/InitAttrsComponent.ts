import type { AttrsComponent } from "./AttrsComponent"
import type { Configuration } from "./configuration"
import type { ElementType, ExtractProps, TObj } from "./utils"

/**
 * Type of the internal `attrsComponent` factory function.
 * Takes a full Configuration and returns an AttrsComponent whose
 * original props (OA) are extracted from the component type C,
 * with all extension slots (EA, S, HOC) starting empty.
 */
export type InitAttrsComponent<C extends ElementType = ElementType> = (
  params: Configuration<C>,
) => AttrsComponent<
  C,
  ExtractProps<C>, // OA — original component props
  TObj, // EA — extended props (empty initially)
  TObj, // S  — statics (empty initially)
  TObj //  HOC — composed HOCs (empty initially)
>
