import type { NodeType } from "@pyreon/connector-document"
import { Text } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocListItem = rocketstyle()({ name: "DocListItem", component: Text })
  .theme({
    fontSize: 14,
    lineHeight: 1.5,
  })
  .attrs(
    (props: any) =>
      ({
        tag: "li",
        _documentProps: {},
      }) as any,
  )

;(DocListItem as any)._documentType = "list-item" satisfies NodeType

export default DocListItem
