import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocDocument = rocketstyle()({ name: "DocDocument", component: Element }).attrs(
  (props: any) =>
    ({
      tag: "div",
      _documentProps: {
        ...(props.title ? { title: props.title } : {}),
        ...(props.author ? { author: props.author } : {}),
        ...(props.subject ? { subject: props.subject } : {}),
      },
    }) as any,
)

;(DocDocument as any)._documentType = "document" satisfies NodeType

export default DocDocument
