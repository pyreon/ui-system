import type { NodeType } from "@pyreon/connector-document"
import { Text } from "@pyreon/elements"
import _rocketstyle from "@pyreon/rocketstyle"

const rocketstyle = _rocketstyle as any

const DocHeading = rocketstyle({
  dimensions: {
    level: ["h1", "h2", "h3", "h4", "h5", "h6"],
  },
  useBooleans: true,
})({ name: "DocHeading", component: Text })
  .theme({
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 12,
  })
  .level({
    h1: { fontSize: 32, lineHeight: 1.2 },
    h2: { fontSize: 24, lineHeight: 1.3 },
    h3: { fontSize: 20, lineHeight: 1.4 },
    h4: { fontSize: 18, lineHeight: 1.4 },
    h5: { fontSize: 16, lineHeight: 1.5 },
    h6: { fontSize: 14, lineHeight: 1.5 },
  })
  .attrs(({ level }: { level?: string }) => {
    const lvl = level ?? "h1"
    const num = Number.parseInt(lvl.replace("h", ""), 10) || 1
    return {
      tag: lvl as any,
      _documentProps: { level: num },
    }
  })

;(DocHeading as any)._documentType = "heading" satisfies NodeType

export default DocHeading
