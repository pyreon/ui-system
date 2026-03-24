import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocTable = rocketstyle({
  dimensions: {
    variants: "variant",
  },
  useBooleans: true,
})({ name: "DocTable", component: Element })
  .theme({
    fontSize: 14,
    borderColor: "#dddddd",
  })
  .attrs(
    (props: any) =>
      ({
        tag: "table",
        _documentProps: {
          columns: props.columns ?? [],
          rows: props.rows ?? [],
          ...(props.headerStyle ? { headerStyle: props.headerStyle } : {}),
          ...(props.striped ? { striped: props.striped } : {}),
          ...(props.bordered ? { bordered: props.bordered } : {}),
          ...(props.caption ? { caption: props.caption } : {}),
        },
      }) as any,
  )

;(DocTable as any)._documentType = "table" satisfies NodeType

export default DocTable
