// @link https://codepen.io/kvendrik/pen/bGKeEE

/**
 * Only titles (h1 to h6), links, bold/italic/strike
 * @param String md
 * @returns String
 */
export const parseMarkdown = (md) => {

    // Titles
    md = md.replace(/[\#]{6}(.+)/g, '<h6>$1</h6>');
    md = md.replace(/[\#]{5}(.+)/g, '<h5>$1</h5>');
    md = md.replace(/[\#]{4}(.+)/g, '<h4>$1</h4>');
    md = md.replace(/[\#]{3}(.+)/g, '<h3>$1</h3>');
    md = md.replace(/[\#]{2}(.+)/g, '<h2>$1</h2>');
    md = md.replace(/[\#]{1}(.+)/g, '<h1>$1</h1>');

    // Images
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');

    // Blockquote
    md = md.replace(/^\>(.+)/gm, '<blockquote>$1</blockquote>');

    // Links
    md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4" target="_blank">$1</a>');

    // Font styles
    md = md.replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, '<b>$1</b>');
    md = md.replace(/[\*\_]{1}([^\*\_]+)[\*\_]{1}/g, '<i>$1</i>');
    md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, '<del>$1</del>');

    // Paragraph
    md = md.replace(/^\s*(\n)?(.+)/gm, function(m){
        return  /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>'+m+'</p>';
    });

    // Strip p from pre
    md = md.replace(/(\<pre.+\>)\s*\n\<p\>(.+)\<\/p\>/gm, '$1$2');

    return md;
}

/**
 * Add markdown tag in input
 * @param String tag
 * @param HTMLElement input
 * @returns String
 */
export const setMarkdownInputValue = (tag, input) => {
    let markers = []
    let value = input.value.split('')
    let selectionStart = input.selectionStart
    let selectionEnd = input.selectionEnd
    let updateValue = true

    // Title
    if (tag.startsWith('h')) {
        const level = tag.split('')[1]
        markers = [`\n${'#'.repeat(level)} `, '']
    }
    else {
        // Other tags (start, end)
        switch (tag) {
            case 'bold':
                markers = ['**', '**']
                break
            case 'italic':
                markers = ['_', '_']
                break
            case 'strike':
                markers = ['~~', '~~']
                break
            case 'blockquote':
                markers = ["\n> ", '']
                break
            case 'link':
                markers = ['[', '](https://link-url.com "Link title")']
                break
            case 'image':
                markers = ['![', '](https://image-url.com)']
                break
        }
    }

    let [markerStart, markerEnd] = markers.map(m => m.split(''))

    selectionEnd = input.selectionEnd + (markerStart.length)

    // Selected text on input
    const selected = input.value.substring(input.selectionStart, input.selectionEnd);

    // No text selected : add the tag name inside its marker
    if (selected.length === 0) {
        const arrayTag = tag.split('')
        markerStart = [...markerStart, ...arrayTag]
        selectionEnd += arrayTag.length
    }
    else {
        // Selection already has tag : don't wrap it again
        if (selected.includes(markerStart.join('')) && selected.includes(markerEnd.join(''))) {
            updateValue = false
        }
    }

    // Wrap the value between tag markers
    if (updateValue) {
        value.splice(selectionStart, 0, ...markerStart)
        value.splice(selectionEnd, 0, ...markerEnd)
    }
    value = value.join('')


    // Focus input and select tag
    setTimeout(() => {
        input.focus()
        input.setSelectionRange(selectionStart, selectionEnd + (markerEnd.length))
    }, 0)

    return value
}