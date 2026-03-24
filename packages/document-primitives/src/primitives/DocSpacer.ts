import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import _rocketstyle from "@pyreon/rocketstyle"

const rocketstyle = _rocketstyle as any

const DocSpacer = rocketstyle()({ name: "DocSpacer", component: Element }).attrs(
  ({ height = 16 }: { height?: number }) => ({
    tag: "div" as any,
    _documentProps: { height },
  }),
)

;(DocSpacer as any)._documentType = "spacer" satisfies NodeType

export default DocSpacer
