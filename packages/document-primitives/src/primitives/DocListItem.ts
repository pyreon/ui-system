import { Text } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocListItem = rocketstyle()({ name: "DocListItem", component: Text })
  .theme({
    fontSize: 14,
    lineHeight: 1.5,
  })
  .statics({ _documentType: "list-item" as const })
  .attrs(
    (props: any) =>
      ({
        tag: "li",
        _documentProps: {},
      }) as any,
  )

export default DocListItem
