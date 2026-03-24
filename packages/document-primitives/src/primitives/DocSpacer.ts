import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocSpacer = rocketstyle()({ name: "DocSpacer", component: Element }).attrs(
  (props: any) =>
    ({
      tag: "div",
      _documentProps: { height: props.height ?? 16 },
    }) as any,
)

;(DocSpacer as any)._documentType = "spacer" satisfies NodeType

export default DocSpacer
