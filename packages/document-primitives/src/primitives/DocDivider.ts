import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocDivider = rocketstyle()({ name: "DocDivider", component: Element })
  .theme({
    borderColor: "#dddddd",
    borderWidth: 1,
  })
  .attrs(
    (props: any) =>
      ({
        tag: "hr",
        _documentProps: {
          ...(props.color ? { color: props.color } : {}),
          ...(props.thickness ? { thickness: props.thickness } : {}),
        },
      }) as any,
  )

;(DocDivider as any)._documentType = "divider" satisfies NodeType

export default DocDivider
