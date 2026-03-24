import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocPageBreak = rocketstyle()({ name: "DocPageBreak", component: Element })
  .statics({ _documentType: "page-break" as const })
  .attrs(
    (props: any) =>
      ({
        tag: "div",
        _documentProps: {},
      }) as any,
  )

export default DocPageBreak
