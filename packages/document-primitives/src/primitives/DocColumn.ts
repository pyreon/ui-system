// @ts-nocheck
import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocColumn = rocketstyle()({ name: "DocColumn", component: Element }).attrs<any>(
  ({ width }: { width?: number | string }) => ({
    tag: "div" as any,
    _documentProps: width != null ? { width } : {},
  }),
)

;(DocColumn as any)._documentType = "column" satisfies NodeType

export default DocColumn
