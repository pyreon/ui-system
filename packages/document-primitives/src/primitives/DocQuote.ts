import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import _rocketstyle from "@pyreon/rocketstyle"

const rocketstyle = _rocketstyle as any

const DocQuote = rocketstyle()({ name: "DocQuote", component: Element })
  .theme({
    borderColor: "#4f46e5",
    padding: "8px 16px",
    fontStyle: "italic",
    color: "#666666",
  })
  .attrs(({ borderColor }: { borderColor?: string }) => ({
    tag: "blockquote" as any,
    _documentProps: borderColor ? { borderColor } : {},
  }))

;(DocQuote as any)._documentType = "quote" satisfies NodeType

export default DocQuote
