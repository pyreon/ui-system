import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocColumn = rocketstyle()({ name: "DocColumn", component: Element }).attrs(
  (props: any) =>
    ({
      tag: "div",
      _documentProps: props.width != null ? { width: props.width } : {},
    }) as any,
)

;(DocColumn as any)._documentType = "column" satisfies NodeType

export default DocColumn
