import type { NodeType } from "@pyreon/connector-document"
import { Text } from "@pyreon/elements"
import _rocketstyle from "@pyreon/rocketstyle"

const rocketstyle = _rocketstyle as any

const DocText = rocketstyle({
  dimensions: {
    variant: ["body", "caption", "label"],
    weight: ["normal", "bold"],
  },
  useBooleans: true,
})({ name: "DocText", component: Text })
  .theme({
    color: "#333333",
    lineHeight: 1.5,
    marginBottom: 8,
  })
  .variant({
    body: { fontSize: 14 },
    caption: { fontSize: 12, color: "#666666" },
    label: { fontSize: 11, fontWeight: "bold" },
  })
  .weight({
    normal: { fontWeight: "normal" },
    bold: { fontWeight: "bold" },
  })
  .attrs(() => ({
    tag: "p" as any,
    _documentProps: {},
  }))

;(DocText as any)._documentType = "text" satisfies NodeType

export default DocText
