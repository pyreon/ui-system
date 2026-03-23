import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocSection = rocketstyle({
  dimensions: {
    direction: ["column", "row"],
  },
  useBooleans: false,
})({ name: "DocSection", component: Element })
  .theme({
    padding: 0,
  })
  .direction({
    column: {},
    row: { direction: "row" },
  })
  .attrs(({ direction }: { direction?: string }) => ({
    tag: "div" as any,
    _documentProps: { direction: direction ?? "column" },
  }))

;(DocSection as any)._documentType = "section" satisfies NodeType

export default DocSection
