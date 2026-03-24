import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocRow = rocketstyle()({ name: "DocRow", component: Element })
  .theme({
    direction: "row",
  })
  .statics({ _documentType: "row" as const })
  .attrs(
    (props: any) =>
      ({
        tag: "div",
        _documentProps: {},
      }) as any,
  )

export default DocRow
