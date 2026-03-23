// @ts-nocheck
import type { NodeType } from "@pyreon/connector-document"
import { Element } from "@pyreon/elements"
import rocketstyle from "@pyreon/rocketstyle"

const DocImage = rocketstyle()({ name: "DocImage", component: Element }).attrs<any>(
  ({
    src,
    alt,
    width,
    height,
    caption,
  }: {
    src?: string
    alt?: string
    width?: number
    height?: number
    caption?: string
  }) => ({
    tag: "img" as any,
    _documentProps: {
      src: src ?? "",
      ...(alt ? { alt } : {}),
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
      ...(caption ? { caption } : {}),
    },
  }),
)

;(DocImage as any)._documentType = "image" satisfies NodeType

export default DocImage
