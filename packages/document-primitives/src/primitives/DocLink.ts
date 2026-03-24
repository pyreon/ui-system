import type { NodeType } from "@pyreon/connector-document"
import { Text } from "@pyreon/elements"
import _rocketstyle from "@pyreon/rocketstyle"

const rocketstyle = _rocketstyle as any

const DocLink = rocketstyle()({ name: "DocLink", component: Text })
  .theme({
    color: "#4f46e5",
    textDecoration: "underline",
  })
  .attrs(({ href }: { href?: string }) => ({
    tag: "a" as any,
    _documentProps: { href: href ?? "#" },
  }))

;(DocLink as any)._documentType = "link" satisfies NodeType

export default DocLink
