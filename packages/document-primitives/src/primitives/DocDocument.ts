// @ts-nocheck
import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocDocument = rocketstyle()({ name: "DocDocument", component: Element }).attrs<any>(
  ({ title, author, subject }: { title?: string; author?: string; subject?: string }) => ({
    tag: "div" as any,
    _documentProps: {
      ...(title ? { title } : {}),
      ...(author ? { author } : {}),
      ...(subject ? { subject } : {}),
    },
  }),
)

;(DocDocument as any)._documentType = "document" satisfies NodeType

export default DocDocument
