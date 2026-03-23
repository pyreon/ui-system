// @ts-nocheck
import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocPageBreak = rocketstyle()({ name: "DocPageBreak", component: Element }).attrs<any>(() => ({
  tag: "div" as any,
  _documentProps: {},
}))

;(DocPageBreak as any)._documentType = "page-break" satisfies NodeType

export default DocPageBreak
