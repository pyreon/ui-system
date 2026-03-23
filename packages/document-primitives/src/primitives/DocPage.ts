// @ts-nocheck
import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocPage = rocketstyle()({ name: "DocPage", component: Element })
  .theme({
    backgroundColor: "#ffffff",
    padding: "25mm",
  })
  .attrs<any>(
    ({
      size,
      orientation,
    }: {
      size?: "A4" | "A3" | "A5" | "letter" | "legal" | "tabloid"
      orientation?: "portrait" | "landscape"
    }) => ({
      tag: "div" as any,
      _documentProps: {
        ...(size ? { size } : {}),
        ...(orientation ? { orientation } : {}),
      },
    }),
  )

;(DocPage as any)._documentType = "page" satisfies NodeType

export default DocPage
