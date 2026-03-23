import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocTable = rocketstyle({
  dimensions: {
    variant: ["default", "striped", "bordered"],
  },
  useBooleans: true,
})({ name: "DocTable", component: Element })
  .theme({
    fontSize: 14,
    borderColor: "#dddddd",
  })
  .attrs(
    ({
      columns,
      rows,
      headerStyle,
      striped,
      bordered,
      caption,
    }: {
      columns?: (string | { header: string; width?: number | string; align?: string })[]
      rows?: (string | number)[][]
      headerStyle?: { background?: string; color?: string; bold?: boolean }
      striped?: boolean
      bordered?: boolean
      caption?: string
    }) => ({
      tag: "table" as any,
      _documentProps: {
        columns: columns ?? [],
        rows: rows ?? [],
        ...(headerStyle ? { headerStyle } : {}),
        ...(striped ? { striped } : {}),
        ...(bordered ? { bordered } : {}),
        ...(caption ? { caption } : {}),
      },
    }),
  )

;(DocTable as any)._documentType = "table" satisfies NodeType

export default DocTable
