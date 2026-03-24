import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocList = rocketstyle()({ name: "DocList", component: Element })
  .theme({
    marginBottom: 8,
    paddingLeft: 20,
  })
  .attrs(
    (props: any) =>
      ({
        tag: props.ordered ? "ol" : "ul",
        _documentProps: props.ordered ? { ordered: props.ordered } : {},
      }) as any,
  )

;(DocList as any)._documentType = "list" satisfies NodeType

export default DocList
