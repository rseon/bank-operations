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
            {tagAllowed.includes('bold') && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('bold')} title="Bold"><strong>B</strong></button>}
            {tagAllowed.includes('italic') && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('italic')} title="Italic"><em>I</em></button>}
            {tagAllowed.includes('strike') && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('strike')} title="Strike"><del>S</del></button>}
            {tagAllowed.includes('link') && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('link')} title="Link">Link</button>}
            {tagAllowed.includes('image') && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('image')} title="Image">Image</button>}
            {tagAllowed.includes('blockquote') && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('blockquote')} title="Blockquote">Blockquote</button>}
            {tagAllowed.includes('title') &&
                <>
                    <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">Title</button>
                    <ul className="dropdown-menu">
                        <li><button type="button" className="dropdown-item h1" onClick={() => insertMarkdown('h1')}>H1</button></li>
                        <li><button type="button" className="dropdown-item h2" onClick={() => insertMarkdown('h2')}>H2</button></li>
                        <li><button type="button" className="dropdown-item h3" onClick={() => insertMarkdown('h3')}>H3</button></li>
                        <li><button type="button" className="dropdown-item h4" onClick={() => insertMarkdown('h4')}>H4</button></li>
                        <li><button type="button" className="dropdown-item h5" onClick={() => insertMarkdown('h5')}>H5</button></li>
                        <li><button type="button" className="dropdown-item h6" onClick={() => insertMarkdown('h6')}>H6</button></li>
                    </ul>
                </>
            }
        </div>
    )
}