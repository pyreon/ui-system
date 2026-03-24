import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocList = rocketstyle()({ name: "DocList", component: Element })
  .theme({
    marginBottom: 8,
    paddingLeft: 20,
  })
  .statics({ _documentType: "list" as const })
  .attrs(
    (props: any) =>
      ({
        tag: props.ordered ? "ol" : "ul",
        _documentProps: props.ordered ? { ordered: props.ordered } : {},
      }) as any,
  )

export default DocList
