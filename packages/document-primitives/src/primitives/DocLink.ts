import type { NodeType } from "@pyreon/connector-document"
import { Text } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocLink = rocketstyle()({ name: "DocLink", component: Text })
  .theme({
    color: "#4f46e5",
    textDecoration: "underline",
  })
  .attrs(
    (props: any) =>
      ({
        tag: "a",
        _documentProps: { href: props.href ?? "#" },
      }) as any,
  )

;(DocLink as any)._documentType = "link" satisfies NodeType

export default DocLink
