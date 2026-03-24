import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocPage = rocketstyle()({ name: "DocPage", component: Element })
  .theme({
    backgroundColor: "#ffffff",
    padding: "25mm",
  })
  .attrs(
    (props: any) =>
      ({
        tag: "div",
        _documentProps: {
          ...(props.size ? { size: props.size } : {}),
          ...(props.orientation ? { orientation: props.orientation } : {}),
        },
      }) as any,
  )

;(DocPage as any)._documentType = "page" satisfies NodeType

export default DocPage
