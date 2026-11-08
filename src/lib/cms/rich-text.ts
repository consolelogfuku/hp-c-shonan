/** A restricted document format shared by the editor, storage and public renderer. */
export type RichMark = { type: string; attrs?: Record<string, string> };
export type RichNode = { type: string; text?: string; attrs?: Record<string, string | number | number[] | null>; marks?: RichMark[]; content?: RichNode[] };
export const mediaPath = /^\/media\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.webp$/;
export function safeLink(href: string) { return /^(https?:\/\/|mailto:|tel:)/i.test(href) || /^\/(?!\/)/.test(href); }
const blocks = ['paragraph', 'heading', 'blockquote', 'bulletList', 'orderedList', 'horizontalRule', 'image', 'table'];
const allowedChildren: Record<string, string[]> = {
  doc: blocks, paragraph: ['text', 'hardBreak'], heading: ['text', 'hardBreak'],
  blockquote: blocks, bulletList: ['listItem'], orderedList: ['listItem'], listItem: blocks,
  table: ['tableRow'], tableRow: ['tableCell', 'tableHeader'], tableCell: blocks, tableHeader: blocks,
  text: [], hardBreak: [], horizontalRule: [], image: [],
};
export function validateRichContent(value: unknown): RichNode {
  let count = 0, textLength = 0;
  function fail(): never { throw new Error('本文の書式を確認してください。'); }
  function node(raw: unknown, depth: number): RichNode {
    if (++count > 5000 || depth > 16 || !raw || typeof raw !== 'object') return fail();
    const item = raw as Record<string, unknown>;
    if (typeof item.type !== 'string' || !Object.hasOwn(allowedChildren, item.type) || (depth === 0) !== (item.type === 'doc')) return fail();
    const result: RichNode = { type: item.type };
    const attrs = (item.attrs || {}) as Record<string, unknown>;
    if (item.type === 'text') {
      if (typeof item.text !== 'string' || !item.text.length) return fail();
      result.text = item.text; textLength += item.text.length;
      if (textLength > 30000) throw new Error('本文は30,000文字以内で入力してください。');
    }
    if (item.type === 'heading') {
      if (![2, 3, 4].includes(Number(attrs.level))) return fail();
      result.attrs = { level: Number(attrs.level) };
    }
    if (['paragraph', 'heading'].includes(item.type) && attrs.textAlign != null) {
      if (!['left', 'center', 'right', 'justify'].includes(String(attrs.textAlign))) return fail();
      result.attrs = { ...result.attrs, textAlign: String(attrs.textAlign) };
    }
    if (item.type === 'orderedList') result.attrs = { start: typeof attrs.start === 'number' && Number.isInteger(attrs.start) && attrs.start > 0 && attrs.start <= 9999 ? attrs.start : 1 };
    if (item.type === 'image') {
      if (typeof attrs.src !== 'string' || !mediaPath.test(attrs.src) || (attrs.alt != null && (typeof attrs.alt !== 'string' || attrs.alt.length > 200))) return fail();
      result.attrs = { src: attrs.src, alt: String(attrs.alt || '') };
    }
    if (['tableCell', 'tableHeader'].includes(item.type)) {
      result.attrs = {};
      for (const key of ['colspan', 'rowspan']) {
        const n = attrs[key] ?? 1;
        if (typeof n !== 'number' || !Number.isInteger(n) || n < 1 || n > 20) return fail();
        result.attrs[key] = n;
      }
      if (Array.isArray(attrs.colwidth) && attrs.colwidth.every(n => typeof n === 'number' && n >= 40 && n <= 1200)) result.attrs.colwidth = attrs.colwidth;
    }
    if (item.content !== undefined) {
      if (!Array.isArray(item.content)) return fail();
      result.content = item.content.map(child => node(child, depth + 1));
      if (result.content.some(child => !allowedChildren[item.type as string].includes(child.type))) return fail();
    }
    if (['bulletList', 'orderedList', 'listItem', 'table', 'tableRow', 'tableCell', 'tableHeader', 'blockquote'].includes(item.type) && !result.content?.length) return fail();
    if (item.marks !== undefined) {
      if (item.type !== 'text' || !Array.isArray(item.marks) || item.marks.length > 8) return fail();
      result.marks = item.marks.map(rawMark => {
        if (!rawMark || typeof rawMark !== 'object') return fail();
        const mark = rawMark as Record<string, unknown>;
        if (['bold', 'italic', 'strike', 'underline'].includes(String(mark.type))) return { type: String(mark.type) };
        const ma = (mark.attrs || {}) as Record<string, unknown>;
        if (mark.type === 'link' && typeof ma.href === 'string' && ma.href.length <= 2000 && safeLink(ma.href)) return { type: 'link', attrs: { href: ma.href } };
        if (mark.type === 'textStyle') {
          const clean: Record<string, string> = {};
          if (ma.color != null) {
            if (typeof ma.color !== 'string' || !/^(#[a-f0-9]{6}|rgb\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}\))$/i.test(ma.color)) return fail();
            clean.color = ma.color;
          }
          if (ma.fontSize != null) {
            if (!['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'].includes(String(ma.fontSize))) return fail();
            clean.fontSize = String(ma.fontSize);
          }
          return { type: 'textStyle', attrs: clean };
        }
        return fail();
      });
    }
    return result;
  }
  return node(value, 0);
}
export function richText(node: RichNode): string {
  if (node.type === 'text') return node.text || '';
  if (node.type === 'hardBreak') return '\n';
  return (node.content || []).map(richText).join(['paragraph', 'heading'].includes(node.type) ? '' : '\n');
}
export function richImages(node: RichNode): string[] {
  return node.type === 'image' ? [String(node.attrs?.src)] : (node.content || []).flatMap(richImages);
}
export function contentFromLegacy(body: string, image?: { src: string; alt: string } | null): RichNode {
  return { type: 'doc', content: [
    ...(image ? [{ type: 'image', attrs: { ...image } }] : []),
    ...body.split(/\n\s*\n/).map(paragraph => ({ type: 'paragraph', content: paragraph.split('\n').flatMap((line, index) => [
      ...(index ? [{ type: 'hardBreak' }] : []), ...(line ? [{ type: 'text', text: line }] : []),
    ]) })),
  ] };
}
