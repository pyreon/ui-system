import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocSpacer = rocketstyle()({ name: "DocSpacer", component: Element }).attrs(
  ({ height = 16 }: { height?: number }) => ({
    tag: "div" as any,
    _documentProps: { height },
  }),
)

;(DocSpacer as any)._documentType = "spacer" satisfies NodeType

export default DocSpacer
