import type { NodeType } from "@pyreon/connector-document"
import { Text } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocCode = rocketstyle()({ name: "DocCode", component: Text })
  .theme({
    fontFamily: "ui-monospace, monospace",
    fontSize: 13,
    backgroundColor: "#f5f5f5",
    padding: "8px 12px",
    borderRadius: 4,
  })
  .attrs(
    (props: any) =>
      ({
        tag: "pre",
        _documentProps: props.language ? { language: props.language } : {},
      }) as any,
  )

;(DocCode as any)._documentType = "code" satisfies NodeType

export default DocCode
