import type { NodeType } from "@pyreon/connector-document"
import { Text } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocText = rocketstyle({
  dimensions: {
    variants: "variant",
    weights: "weight",
  },
  useBooleans: true,
})({ name: "DocText", component: Text })
  .theme({
    color: "#333333",
    lineHeight: 1.5,
    marginBottom: 8,
  })
  .variants({
    body: { fontSize: 14 },
    caption: { fontSize: 12, color: "#666666" },
    label: { fontSize: 11, fontWeight: "bold" },
  })
  .weights({
    normal: { fontWeight: "normal" },
    bold: { fontWeight: "bold" },
  })
  .attrs(
    (props: any) =>
      ({
        tag: "p",
        _documentProps: {},
      }) as any,
  )

;(DocText as any)._documentType = "text" satisfies NodeType

export default DocText
