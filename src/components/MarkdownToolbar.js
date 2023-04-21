import {setMarkdownInputValue} from "@/helpers/markdown";

export default function MarkdownToolbar({ input, onMarkdown }) {
    const insertMarkdown = (tag) => {
        onMarkdown(setMarkdownInputValue(tag, input))
    }

    return (
        <div className="btn-group ms-4">
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('bold')}><strong>B</strong></button>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('italic')}><em>I</em></button>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('strike')}><del>S</del></button>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertMarkdown('link')}>Link</button>
            <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">Title</button>
            <ul className="dropdown-menu">
                <li><button type="button" className="dropdown-item h1" onClick={() => insertMarkdown('h1')}>H1</button></li>
                <li><button type="button" className="dropdown-item h2" onClick={() => insertMarkdown('h2')}>H2</button></li>
                <li><button type="button" className="dropdown-item h3" onClick={() => insertMarkdown('h3')}>H3</button></li>
                <li><button type="button" className="dropdown-item h4" onClick={() => insertMarkdown('h4')}>H4</button></li>
                <li><button type="button" className="dropdown-item h5" onClick={() => insertMarkdown('h5')}>H5</button></li>
                <li><button type="button" className="dropdown-item h6" onClick={() => insertMarkdown('h6')}>H6</button></li>
            </ul>
        </div>
    )
}