import React, { useCallback, useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import FontFamily from '@tiptap/extension-font-family';
import {TextStyle} from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { Extension } from '@tiptap/core'
import BulletList from '@tiptap/extension-bullet-list'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { mediaAPI } from '../services/api'

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => {
              const fontSizeRaw = element.style.fontSize;
              if (fontSizeRaw) {
                return fontSizeRaw.replace(/['"]+/g, '');
              }
              return null;
            },
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize }).run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
      },
    }
  },
})

const CustomBulletList = BulletList.extend({
  addAttributes() {
    return {
      listStyleType: {
        default: 'disc',
        parseHTML: element => element.style.listStyleType || 'disc',
        renderHTML: attributes => {
          if (!attributes.listStyleType || attributes.listStyleType === 'disc') {
            return { style: 'list-style-type: disc' }
          }
          return { style: `list-style-type: ${attributes.listStyleType}` }
        },
      },
    }
  },
})

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Link as LinkIcon,
  Copy,
  Loader,
  Palette,
  Highlighter
} from 'lucide-react'
import '../styles/RichEditor.css'

const RichEditor = ({ content, onChange, blogId, ownerType = 'blog', ownerId }) => {
  const [uploading, setUploading] = useState(false)
  const currentOwnerId = ownerId || blogId // Support both prop names for compatibility

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false, // We use our custom extension instead
      }),
      CustomBulletList,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      Color.configure({ types: ['textStyle'] }),
      Highlight.configure({ multicolor: true }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      handlePaste: (view, event, slice) => {
        const items = Array.from(event.clipboardData?.items || []);
        
        for (const item of items) {
          if (item.type.indexOf('image') === 0) {
            event.preventDefault();
            const file = item.getAsFile();
            if (!file) continue;

            if (file.size > 10 * 1024 * 1024) {
              alert('Image size should be less than 10MB');
              return true; // handled
            }

            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('owner_type', ownerType);
            if (currentOwnerId) formData.append('owner_id', currentOwnerId);

            mediaAPI.uploadInline(formData)
              .then(response => {
                const imageUrl = response.data?.url;
                if (imageUrl) {
                  const { schema } = view.state;
                  const node = schema.nodes.image.create({ src: imageUrl });
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                }
              })
              .catch(err => {
                console.error('Image paste upload failed:', err);
                alert('Failed to upload pasted image. Please try again.');
              })
              .finally(() => {
                setUploading(false);
              });
            return true; // handled
          }
        }
        return false; // let tip tap handle normal paste
      }
    }
  })

  const [customFontSize, setCustomFontSize] = useState('');

  // Listen for selection changes to update the active font size automatically
  useEffect(() => {
    if (!editor) return;

    const handleTransaction = () => {
      const activeFontSize = editor.getAttributes('textStyle').fontSize || '';
      setCustomFontSize(activeFontSize);
    };

    editor.on('transaction', handleTransaction);

    return () => {
      editor.off('transaction', handleTransaction);
    };
  }, [editor]);

  const currentFontSize = customFontSize;

  const applyCustomFontSize = useCallback(() => {
    if (!editor) return;
    if (customFontSize) {
      editor.chain().focus().setFontSize(customFontSize).run();
    } else {
      editor.chain().focus().unsetFontSize().run();
    }
  }, [editor, customFontSize]);

  const handleCustomFontSizeKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyCustomFontSize();
    }
  }, [applyCustomFontSize]);

  // Font size constants and helpers
  const FONT_SIZES = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px'];

  const handleIncreaseFontSize = useCallback(() => {
    if (!editor) return;
    const currentSize = editor.getAttributes('textStyle').fontSize || '16px';
    const pxValue = parseInt(currentSize);
    if (!isNaN(pxValue)) {
      const nextSize = `${pxValue + 2}px`;
      setCustomFontSize(nextSize);
      editor.chain().focus().setFontSize(nextSize).run();
    } else {
      const currentIndex = FONT_SIZES.indexOf(currentSize);
      let nextSize = '18px'; // Default step up from 16px if unknown
      if (currentIndex !== -1 && currentIndex < FONT_SIZES.length - 1) {
        nextSize = FONT_SIZES[currentIndex + 1];
      }
      setCustomFontSize(nextSize);
      editor.chain().focus().setFontSize(nextSize).run();
    }
  }, [editor]);

  const handleDecreaseFontSize = useCallback(() => {
    if (!editor) return;
    const currentSize = editor.getAttributes('textStyle').fontSize || '16px';
    const pxValue = parseInt(currentSize);
    if (!isNaN(pxValue) && pxValue > 2) {
      const prevSize = `${pxValue - 2}px`;
      setCustomFontSize(prevSize);
      editor.chain().focus().setFontSize(prevSize).run();
    } else {
      const currentIndex = FONT_SIZES.indexOf(currentSize);
      let prevSize = '14px'; // Default step down from 16px if unknown
      if (currentIndex > 0) {
        prevSize = FONT_SIZES[currentIndex - 1];
      }
      setCustomFontSize(prevSize);
      editor.chain().focus().setFontSize(prevSize).run();
    }
  }, [editor]);

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB')
        return
      }

      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('owner_type', ownerType)
        if (currentOwnerId) formData.append('owner_id', currentOwnerId)

        const response = await mediaAPI.uploadInline(formData)
        const imageUrl = response.data?.url

        if (imageUrl && editor) {
          editor.chain().focus().setImage({ src: imageUrl }).run()
        }
      } catch (err) {
        console.error('Image upload failed:', err)
        alert('Failed to upload image. Please try again.')
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }, [editor, blogId])



  const handleAddLink = useCallback(() => {
    const url = window.prompt('Enter the URL:')
    if (url) {
      if (editor) {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url })
          .run()
      }
    }
  }, [editor])

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <div className="rich-editor">
      {uploading && (
        <div className="editor-upload-overlay">
          <Loader size={24} className="spin-animation" />
          <span>Uploading media...</span>
        </div>
      )}
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'active' : ''}
            title="Bold (Ctrl+B)"
          >
            <Bold size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'active' : ''}
            title="Italic (Ctrl+I)"
          >
            <Italic size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'active' : ''}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon size={18} />
          </button>
          {/* Font Family Selection */}
          <select
            className="editor-font-family-select"
            value={editor.getAttributes('textStyle').fontFamily || ''}
            onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
            title="Font Family"
          >
            <option value="">Default</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Impact">Impact</option>
            <option value="Lucida Console">Lucida Console</option>
            <option value="Palatino">Palatino</option>
            <option value="Garamond">Garamond</option>
            <option value="Brush Script MT">Brush Script MT</option>
            <option value="Monospace">Monospace</option>
            <option value="Sans-serif">Sans-serif</option>
            <option value="Serif">Serif</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Cursive">Cursive</option>
          </select>
          {/* Font Size Selection */}
          <select
            className="editor-font-size-select"
            value={currentFontSize}
            onChange={e => editor.chain().focus().setFontSize(e.target.value).run()}
            title="Font Size"
          >
            <option value="">Default</option>
            {FONT_SIZES.map(size => (
               <option key={size} value={size}>{size}</option>
            ))}
            {!FONT_SIZES.includes(currentFontSize) && currentFontSize !== '' && (
               <option value={currentFontSize}>{currentFontSize}</option>
            )}
            <option value="2em">2em</option>
            <option value="120%">120%</option>
          </select>
          <input
            className="editor-font-size-input"
            value={customFontSize}
            onChange={e => setCustomFontSize(e.target.value)}
            onBlur={applyCustomFontSize}
            onKeyDown={handleCustomFontSizeKeyDown}
            placeholder="Custom size (e.g. 16px, 2em)"
            title="Custom Font Size (Press Enter)"
            type="text"
            style={{ width: '120px', marginLeft: '8px' }}
          />
          <button
            type="button"
            onClick={handleIncreaseFontSize}
            title="Increase Font Size"
            style={{ fontWeight: 'bold' }}
          >
            A+
          </button>
          <button
            type="button"
            onClick={handleDecreaseFontSize}
            title="Decrease Font Size"
            style={{ fontWeight: 'bold' }}
          >
            A-
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
            title="Heading 3"
          >
            <Heading3 size={18} />
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
        </div>

        <div className="toolbar-group">
          <div className="dropdown-container">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'active' : ''}
              title="Bullet List"
            >
              <List size={18} />
            </button>
            <select
              className="editor-font-family-select"
              value={editor.getAttributes('bulletList').listStyleType || 'disc'}
              onChange={e => {
                if (!editor.isActive('bulletList')) {
                   editor.chain().focus().toggleBulletList().run();
                }
                editor.chain().focus().updateAttributes('bulletList', { listStyleType: e.target.value }).run();
              }}
              title="Bullet Style"
              style={{ paddingLeft: '2px', paddingRight: '2px', marginLeft: '-4px', borderLeft: 'none', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, background: '#fff' }}
            >
              <option value="disc">●</option>
              <option value="circle">○</option>
              <option value="square">■</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'active' : ''}
            title="Ordered List"
          >
            <ListOrdered size={18} />
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={handleImageUpload}
            title="Insert Image"
            disabled={uploading}
          >
            <ImageIcon size={18} />
          </button>
          <button
            type="button"
            onClick={handleAddLink}
            title="Add Link"
          >
            <LinkIcon size={18} />
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().clearNodes().run()}
            title="Clear Formatting"
          >
            <Copy size={18} />
          </button>
        </div>

        <div className="toolbar-group">
          <div className="color-picker-container">
            <label htmlFor="text-color" title="Text Color" className="color-picker-label">
              <Palette size={18} />
            </label>
            <input
              id="text-color"
              type="color"
              value={editor.getAttributes('textStyle').color || '#000000'}
              onChange={e => editor.chain().focus().setColor(e.target.value).run()}
              className="color-picker-input"
              title="Change text color"
            />
          </div>
          <div className="color-picker-container">
            <label htmlFor="highlight-color" title="Text Highlight" className="color-picker-label">
              <Highlighter size={18} />
            </label>
            <input
              id="highlight-color"
              type="color"
              value={editor.getAttributes('highlight').color || '#FFFF00'}
              onChange={e => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
              className="color-picker-input"
              title="Change highlight color"
            />
          </div>
        </div>
      </div>

      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default RichEditor