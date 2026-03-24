import { Text } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocLink = rocketstyle()({ name: "DocLink", component: Text })
  .theme({
    color: "#4f46e5",
    textDecoration: "underline",
  })
  .statics({ _documentType: "link" as const })
  .attrs(
    (props: any) =>
      ({
        tag: "a",
        _documentProps: { href: props.href ?? "#" },
      }) as any,
  )

export default DocLink
