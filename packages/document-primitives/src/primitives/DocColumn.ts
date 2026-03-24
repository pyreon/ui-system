import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocColumn = rocketstyle()({ name: "DocColumn", component: Element })
  .statics({ _documentType: "column" as const })
  .attrs(
    (props: any) =>
      ({
        tag: "div",
        _documentProps: props.width != null ? { width: props.width } : {},
      }) as any,
  )

export default DocColumn
