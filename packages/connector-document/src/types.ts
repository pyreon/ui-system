/**
 * Types mirroring @pyreon/document's type definitions.
 * When @pyreon/document is published, these can be replaced with:
 *   import type { DocNode, ResolvedStyles, ... } from '@pyreon/document'
 */

export type NodeType =
  | "document"
  | "page"
  | "section"
  | "row"
  | "column"
  | "heading"
  | "text"
  | "link"
  | "image"
  | "table"
  | "list"
  | "list-item"
  | "page-break"
  | "code"
  | "divider"
  | "spacer"
  | "button"
  | "quote"

export interface DocNode {
  type: NodeType
  props: Record<string, unknown>
  children: DocChild[]
  styles?: ResolvedStyles
}

export type DocChild = DocNode | string

export interface ResolvedStyles {
  fontSize?: number
  fontFamily?: string
  fontWeight?: "normal" | "bold" | number
  fontStyle?: "normal" | "italic"
  textDecoration?: "none" | "underline" | "line-through"
  color?: string
  backgroundColor?: string
  textAlign?: "left" | "center" | "right" | "justify"
  lineHeight?: number
  letterSpacing?: number
  padding?: number | [number, number] | [number, number, number, number]
  margin?: number | [number, number] | [number, number, number, number]
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  borderStyle?: "solid" | "dashed" | "dotted"
  width?: number | string
  height?: number | string
  maxWidth?: number | string
  opacity?: number
}
