import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocDivider = rocketstyle()({ name: "DocDivider", component: Element })
  .theme({
    borderColor: "#dddddd",
    borderWidth: 1,
  })
  .statics({ _documentType: "divider" as const })
  .attrs(
    (props: any) =>
      ({
        tag: "hr",
        _documentProps: {
          ...(props.color ? { color: props.color } : {}),
          ...(props.thickness ? { thickness: props.thickness } : {}),
        },
      }) as any,
  )

export default DocDivider
