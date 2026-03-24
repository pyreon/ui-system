import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocSection = rocketstyle({
  dimensions: {
    directions: "direction",
  },
  useBooleans: false,
})({ name: "DocSection", component: Element })
  .theme({
    padding: 0,
  })
  .directions({
    column: {},
    row: { direction: "row" },
  })
  .statics({ _documentType: "section" as const })
  .attrs(
    (props: any) =>
      ({
        tag: "div",
        _documentProps: { direction: props.direction ?? "column" },
      }) as any,
  )

export default DocSection
