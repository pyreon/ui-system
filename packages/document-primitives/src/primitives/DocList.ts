import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocList = rocketstyle()({ name: "DocList", component: Element })
  .theme({
    marginBottom: 8,
    paddingLeft: 20,
  })
  .attrs(({ ordered }: { ordered?: boolean }) => ({
    tag: (ordered ? "ol" : "ul") as any,
    _documentProps: ordered ? { ordered } : {},
  }))

;(DocList as any)._documentType = "list" satisfies NodeType

export default DocList
