import type { NodeType } from "@pyreon/connector-document"
import { Text } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocButton = rocketstyle({
  dimensions: {
    variant: ["primary", "secondary"],
  },
  useBooleans: true,
})({ name: "DocButton", component: Text })
  .theme({
    fontSize: 14,
    fontWeight: "bold",
    padding: "10px 24px",
    borderRadius: 4,
    textAlign: "center",
    textDecoration: "none",
  })
  .variant({
    primary: {
      backgroundColor: "#4f46e5",
      color: "#ffffff",
    },
    secondary: {
      backgroundColor: "#ffffff",
      color: "#4f46e5",
      borderWidth: 1,
      borderColor: "#4f46e5",
      borderStyle: "solid",
    },
  })
  .attrs(({ href }: { href?: string }) => ({
    tag: "a" as any,
    _documentProps: { href: href ?? "#" },
  }))

;(DocButton as any)._documentType = "button" satisfies NodeType

export default DocButton
