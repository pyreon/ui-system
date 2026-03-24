import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import _rocketstyle from "@pyreon/rocketstyle"

const rocketstyle = _rocketstyle as any

const DocPageBreak = rocketstyle()({ name: "DocPageBreak", component: Element }).attrs(() => ({
  tag: "div" as any,
  _documentProps: {},
}))

;(DocPageBreak as any)._documentType = "page-break" satisfies NodeType

export default DocPageBreak
