import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocPage = rocketstyle()({ name: "DocPage", component: Element })
  .theme({
    backgroundColor: "#ffffff",
    padding: "25mm",
  })
  .statics({ _documentType: "page" as const })
  .attrs(
    (props: any) =>
      ({
        tag: "div",
        _documentProps: {
          ...(props.size ? { size: props.size } : {}),
          ...(props.orientation ? { orientation: props.orientation } : {}),
        },
      }) as any,
  )

export default DocPage
