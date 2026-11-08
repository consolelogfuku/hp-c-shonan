import { Fragment, type CSSProperties, type ReactNode } from "react";
import { contentFromLegacy, safeLink, type RichNode } from "@/lib/cms/rich-text";
import "./article-body.css";

function renderNode(node: RichNode): ReactNode {
  const children = node.content?.map((child, index) => <Fragment key={index}>{renderNode(child)}</Fragment>);
  const attrs = node.attrs || {};
  const style = { textAlign: attrs.textAlign } as CSSProperties;
  switch (node.type) {
    case 'doc': return children;
    case 'text': return (node.marks || []).reduce<ReactNode>((value, mark) => {
      switch (mark.type) {
        case 'bold': return <strong>{value}</strong>;
        case 'italic': return <em>{value}</em>;
        case 'underline': return <u>{value}</u>;
        case 'strike': return <s>{value}</s>;
        case 'textStyle': return <span style={{ color: mark.attrs?.color, fontSize: mark.attrs?.fontSize }}>{value}</span>;
        case 'link': return safeLink(mark.attrs?.href || '') ? <a href={mark.attrs!.href} target="_blank" rel="noopener noreferrer">{value}</a> : value;
        default: return value;
      }
    }, node.text);
    case 'paragraph': return <p style={style}>{children?.length ? children : <br />}</p>;
    case 'heading': return attrs.level === 2 ? <h2 style={style}>{children}</h2> : attrs.level === 3 ? <h3 style={style}>{children}</h3> : <h4 style={style}>{children}</h4>;
    case 'hardBreak': return <br />;
    case 'bulletList': return <ul>{children}</ul>;
    case 'orderedList': return <ol start={Number(attrs.start) || 1}>{children}</ol>;
    case 'listItem': return <li>{children}</li>;
    case 'blockquote': return <blockquote>{children}</blockquote>;
    case 'horizontalRule': return <hr />;
    case 'image': return <img src={String(attrs.src)} alt={String(attrs.alt || '')} />;
    case 'table': return <div className="tableWrapper"><table><tbody>{children}</tbody></table></div>;
    case 'tableRow': return <tr>{children}</tr>;
    case 'tableCell': return <td colSpan={Number(attrs.colspan) || 1} rowSpan={Number(attrs.rowspan) || 1}>{children}</td>;
    case 'tableHeader': return <th colSpan={Number(attrs.colspan) || 1} rowSpan={Number(attrs.rowspan) || 1}>{children}</th>;
    default: return null;
  }
}
export function ArticleBody({ content, body, image }: { content?: RichNode; body: string; image?: { src: string; alt: string } | null }) {
  return <div className="news-prose">{renderNode(content || contentFromLegacy(body, image))}</div>;
}
