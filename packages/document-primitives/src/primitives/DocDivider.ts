import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocDivider = rocketstyle()({ name: "DocDivider", component: Element })
  .theme({
    borderColor: "#dddddd",
    borderWidth: 1,
  })
  .attrs(({ color, thickness }: { color?: string; thickness?: number }) => ({
    tag: "hr" as any,
    _documentProps: {
      ...(color ? { color } : {}),
      ...(thickness ? { thickness } : {}),
    },
  }))

;(DocDivider as any)._documentType = "divider" satisfies NodeType

export default DocDivider
