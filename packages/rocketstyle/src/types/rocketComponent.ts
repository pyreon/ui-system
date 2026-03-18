import type { Configuration } from "./configuration"
import type { DefaultDimensions, Dimensions } from "./dimensions"
import type { RocketStyleComponent } from "./rocketstyle"
import type { ElementType, ExtractProps, TObj } from "./utils"

export type RocketComponent<
  C extends ElementType = ElementType,
  T extends TObj = TObj,
  CSS extends TObj = TObj,
  D extends Dimensions = DefaultDimensions,
  UB extends boolean = boolean,
> = (props: Configuration<C, D>) => RocketStyleComponent<
  // keep original component props + extract dimension props
  ExtractProps<C>,
  // set default extending props
  TObj,
  T,
  CSS,
  TObj,
  TObj,
  D,
  UB,
  Record<string, any>
>
