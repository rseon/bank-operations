import {setMarkdownInputValue} from "@/helpers/markdown";
import {useMemo} from "react";
import {isEmpty} from "@/helpers";

export default function MarkdownToolbar({ input, onMarkdown, allowed = [] }) {
    const insertMarkdown = (tag) => {
        onMarkdown(setMarkdownInputValue(tag, input))
    }

    const tagAllowed = useMemo(() => {
        return !isEmpty(allowed)
            ? allowed
            : ['bold', 'italic', 'strike', 'link', 'image', 'blockquote', 'title']
    }, [allowed])

    return (
        <div className="ms-4 btn-group">
            {tagAllowed.includes('bold') && <button type="button" tabIndex={-1} className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('bold')} title="Bold"><strong>B</strong></button>}
            {tagAllowed.includes('italic') && <button type="button" tabIndex={-1} className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('italic')} title="Italic"><em>I</em></button>}
            {tagAllowed.includes('strike') && <button type="button" tabIndex={-1} className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('strike')} title="Strike"><del>S</del></button>}
            {tagAllowed.includes('link') && <button type="button" tabIndex={-1} className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('link')} title="Link">Link</button>}
            {tagAllowed.includes('image') && <button type="button" tabIndex={-1} className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('image')} title="Image">Image</button>}
            {tagAllowed.includes('blockquote') && <button type="button" tabIndex={-1} className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('blockquote')} title="Blockquote">Blockquote</button>}
        </div>
    )
}