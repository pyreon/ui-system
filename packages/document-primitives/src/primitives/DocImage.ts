import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocImage = rocketstyle()({ name: "DocImage", component: Element }).attrs(
  (props: any) =>
    ({
      tag: "img",
      _documentProps: {
        src: props.src ?? "",
        ...(props.alt ? { alt: props.alt } : {}),
        ...(props.width ? { width: props.width } : {}),
        ...(props.height ? { height: props.height } : {}),
        ...(props.caption ? { caption: props.caption } : {}),
      },
    }) as any,
)

;(DocImage as any)._documentType = "image" satisfies NodeType

export default DocImage
