import { useEffect, useRef, useState, type ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, Color, FontSize } from "@tiptap/extension-text-style";
import { TableKit } from "@tiptap/extension-table";
import { TextB, TextItalic, TextUnderline, TextStrikethrough, ListBullets, ListNumbers, Link as LinkIcon, Quotes, TextAlignLeft, TextAlignCenter, TextAlignRight, TextIndent, TextOutdent, Table as TableIcon, Minus, ImageSquare, ArrowCounterClockwise, ArrowClockwise } from "@phosphor-icons/react";
import { richText, safeLink, type RichNode } from "@/lib/cms/rich-text";
import { prepareUpload } from "@/lib/cms/image-upload";
import "@/components/news/article-body.css";

export function RichTextEditor({ value, disabled, onChange, onError, onUploading, ariaLabel = "本文", placeholder = "お知らせの内容を入力してください。" }: { value: RichNode; disabled: boolean; onChange: (content: RichNode, body: string) => void; onError: (error: string) => void; onUploading: (uploading: boolean) => void; ariaLabel?: string; placeholder?: string }) {
  const picker = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<(files: File[], pos?: number) => void>(() => {});
  const uploading = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, code: false, codeBlock: false, link: { openOnClick: false, autolink: false, defaultProtocol: 'https' } }),
      Image.configure({ allowBase64: false }), TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle, Color, FontSize, TableKit.configure({ table: { resizable: false } }),
    ],
    content: value,
    editorProps: {
      attributes: { class: 'news-prose cms-rich-content', role: 'textbox', 'aria-label': ariaLabel, 'aria-multiline': 'true', 'data-placeholder': placeholder },
      handleDrop(view, event) {
        const files = Array.from(event.dataTransfer?.files || []);
        if (!files.length) return false;
        event.preventDefault(); setDragging(false);
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        uploadRef.current(files, pos); return true;
      },
      handlePaste(_view, event) {
        const files = Array.from(event.clipboardData?.files || []);
        if (!files.length) return false;
        event.preventDefault(); uploadRef.current(files); return true;
      },
    },
    onUpdate: ({ editor }) => { const content = editor.getJSON() as RichNode; onChange(content, richText(content)); },
  });
  useEffect(() => { editor?.setEditable(!disabled, false); }, [editor, disabled]);
  useEffect(() => {
    if (editor && JSON.stringify(editor.getJSON()) !== JSON.stringify(value)) editor.chain().setMeta("addToHistory", false).setContent(value, { emitUpdate: false }).run();
  }, [editor, value]);

  uploadRef.current = async (files, pos) => {
    if (!files.length || !editor || disabled || uploading.current) return;
    if (files.some(file => !['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024)) {
      onError('8MB以下のJPEG・PNG・WebP画像を選んでください。'); return;
    }
    if (files.length > 10) { onError('画像は一度に10枚まで追加できます。'); return; }
    uploading.current = true; onUploading(true); onError('');
    editor.setEditable(false, false);
    // Preserve the insertion point while files upload; editing remains locked.
    const at = pos ?? editor.state.selection.from;
    const images: RichNode[] = [];
    let uploadError = '';
    try {
      for (const file of files) {
        const image = await prepareUpload(file);
        const data = new FormData(); data.set('image', image, 'image.webp');
        const response = await fetch('/api/admin/media', { method: 'POST', body: data });
        const result = await response.json() as { src?: string; error?: string };
        if (!response.ok || !result.src) throw new Error(result.error || '画像を追加できませんでした。');
        images.push({ type: 'image', attrs: { src: result.src, alt: '' } });
      }
    } catch (error) { uploadError = error instanceof Error ? error.message : '画像を追加できませんでした。'; }
    finally {
      // Keep any successful uploads visible even if a later file fails.
      if (images.length) editor.chain().focus().insertContentAt(at, [...images, { type: 'paragraph' }]).run();
      if (uploadError) onError(uploadError);
      uploading.current = false; onUploading(false); editor.setEditable(true, false);
    }
  };
  if (!editor) return <div className="cms-rich-loading">エディターを読み込み中…</div>;
  const tool = (label: string, icon: ReactNode, command: () => void, active = false, unavailable = false) => <button type="button" key={label} className="cms-tool" aria-label={label} title={label} aria-pressed={active} disabled={disabled || unavailable} onMouseDown={event => event.preventDefault()} onClick={command}>{icon}</button>;
  const iconSize = 19;
  const selectedImage = editor.isActive('image');
  const applyLink = () => {
    const href = linkUrl.trim();
    if (href && !safeLink(href)) { setLinkError('https:// で始まるURL、メールアドレス（mailto:）、電話番号（tel:）を入力してください。'); return; }
    if (href) editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    else editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkOpen(false); setLinkError('');
  };
  return <div className={`cms-rich-editor ${dragging ? 'is-dragging' : ''}`} aria-busy={disabled}
    onDragOver={event => { if (event.dataTransfer.types.includes('Files')) { event.preventDefault(); setDragging(true); } }}
    onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false); }}
    onDrop={event => { setDragging(false); if (!event.defaultPrevented && event.dataTransfer.files.length) { event.preventDefault(); uploadRef.current(Array.from(event.dataTransfer.files)); } }}>
    <div className="cms-editor-toolbar" role="group" aria-label="本文の書式">
      <select aria-label="見出し" title="見出し" disabled={disabled} value={editor.isActive('heading') ? String(editor.getAttributes('heading').level) : 'paragraph'} onChange={event => { if (event.target.value === 'paragraph') editor.chain().focus().setParagraph().run(); else editor.chain().focus().toggleHeading({ level: Number(event.target.value) as 2 | 3 | 4 }).run(); }}><option value="paragraph">標準の本文</option><option value="2">大見出し</option><option value="3">中見出し</option><option value="4">小見出し</option></select>
      <span className="cms-tool-separator" />
      {tool('太字', <TextB size={iconSize} />, () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
      {tool('斜体', <TextItalic size={iconSize} />, () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
      {tool('取り消し線', <TextStrikethrough size={iconSize} />, () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'))}
      {tool('下線', <TextUnderline size={iconSize} />, () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}
      <select aria-label="文字サイズ" title="文字サイズ" disabled={disabled} value={editor.getAttributes('textStyle').fontSize || ''} onChange={event => { if (event.target.value) editor.chain().focus().setFontSize(event.target.value).run(); else editor.chain().focus().unsetFontSize().run(); }}><option value="">文字サイズ</option>{[12, 14, 16, 18, 20, 24, 28, 32].map(n => <option value={`${n}px`} key={n}>{n}px</option>)}</select>
      <label className="cms-color-tool" title="文字色"><span aria-hidden>A</span><input type="color" aria-label="文字色" disabled={disabled} defaultValue="#213d50" onChange={event => editor.chain().focus().setColor(event.target.value).run()} /></label>
      <span className="cms-tool-separator" />
      {tool('箇条書き', <ListBullets size={iconSize} />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
      {tool('番号付きリスト', <ListNumbers size={iconSize} />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
      {tool('リンク', <LinkIcon size={iconSize} />, () => { setLinkUrl(editor.getAttributes('link').href || ''); setLinkError(''); setLinkOpen(!linkOpen); }, editor.isActive('link'))}
      {tool('引用', <Quotes size={iconSize} />, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}
      {tool('左揃え', <TextAlignLeft size={iconSize} />, () => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }))}
      {tool('中央揃え', <TextAlignCenter size={iconSize} />, () => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }))}
      {tool('右揃え', <TextAlignRight size={iconSize} />, () => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }))}
      {tool('リストの階層を下げる', <TextIndent size={iconSize} />, () => editor.chain().focus().sinkListItem('listItem').run(), false, !editor.can().sinkListItem('listItem'))}
      {tool('リストの階層を上げる', <TextOutdent size={iconSize} />, () => editor.chain().focus().liftListItem('listItem').run(), false, !editor.can().liftListItem('listItem'))}
      {tool('表を挿入', <TableIcon size={iconSize} />, () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), false, editor.isActive('table'))}
      {tool('区切り線', <Minus size={iconSize} />, () => editor.chain().focus().setHorizontalRule().run())}
      {tool('画像を挿入', <ImageSquare size={iconSize} />, () => picker.current?.click())}
      <span className="cms-tool-separator" />
      {tool('元に戻す', <ArrowCounterClockwise size={iconSize} />, () => editor.chain().focus().undo().run(), false, !editor.can().undo())}
      {tool('やり直す', <ArrowClockwise size={iconSize} />, () => editor.chain().focus().redo().run(), false, !editor.can().redo())}
    </div>
    {linkOpen && <div className="cms-inline-controls"><label>リンク先<input aria-label="リンク先URL" type="url" value={linkUrl} placeholder="https://example.com" disabled={disabled} onChange={event => setLinkUrl(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); applyLink(); } }} /></label><button className="cms-button" type="button" disabled={disabled} onClick={applyLink}>適用</button><button className="cms-text-button" type="button" disabled={disabled} onClick={() => { editor.chain().focus().unsetLink().run(); setLinkOpen(false); }}>リンクを解除</button><button className="cms-text-button" type="button" onClick={() => setLinkOpen(false)}>閉じる</button>{linkError && <p role="alert">{linkError}</p>}</div>}
    {editor.isActive('table') && <div className="cms-inline-controls" role="group" aria-label="表の編集">{[
      ['行を追加', () => editor.chain().focus().addRowAfter().run()], ['列を追加', () => editor.chain().focus().addColumnAfter().run()],
      ['行を削除', () => editor.chain().focus().deleteRow().run()], ['列を削除', () => editor.chain().focus().deleteColumn().run()],
      ['表を削除', () => editor.chain().focus().deleteTable().run()],
    ].map(([label, action]) => <button type="button" className="cms-text-button" key={String(label)} disabled={disabled} onMouseDown={event => event.preventDefault()} onClick={action as () => void}>{String(label)}</button>)}</div>}
    {selectedImage && <div className="cms-inline-controls"><label>画像の説明（任意）<input aria-label="画像の説明" maxLength={200} value={editor.getAttributes('image').alt || ''} disabled={disabled} onChange={event => editor.commands.updateAttributes('image', { alt: event.target.value })} /></label><button className="cms-text-button cms-danger" type="button" disabled={disabled} onClick={() => editor.chain().focus().deleteSelection().run()}>画像を削除</button></div>}
    <EditorContent editor={editor} />
    <div className="cms-editor-dropzone"><ImageSquare size={22} aria-hidden /><span>{uploading.current ? '画像を追加しています…' : '画像をここにドロップ、または'}</span><button type="button" disabled={disabled} className="cms-text-button" onClick={() => picker.current?.click()}>ファイルを選択</button><small>本文のカーソル位置に挿入 · JPEG / PNG / WebP · 8MBまで</small></div>
    <input ref={picker} className="cms-sr" type="file" aria-label="本文に画像を追加" accept="image/jpeg,image/png,image/webp" multiple disabled={disabled} onChange={event => { uploadRef.current(Array.from(event.target.files || [])); event.target.value = ''; }} />
  </div>;
}
