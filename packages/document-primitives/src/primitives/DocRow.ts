import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocRow = rocketstyle()({ name: "DocRow", component: Element })
  .theme({
    direction: "row",
  })
  .attrs(
    (props: any) =>
      ({
        tag: "div",
        _documentProps: {},
      }) as any,
  )

;(DocRow as any)._documentType = "row" satisfies NodeType

export default DocRow
