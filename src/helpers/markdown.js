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
    let markerStart = '', markerEnd = ''
    let value = input.value
    let start = input.selectionStart
    let end = input.selectionEnd + (markerStart.length)
    let updateValue = true

    // Title added on new line at the end
    if (tag.startsWith('h')) {
        const level = tag.split('')[1]
        value +=`\n${'#'.repeat(level)} Title ${level}`
        start = value.length
        end = start
    }
    else {
        // Tag wraps selected text
        value = value.split('')
        switch(tag) {
            case 'bold': markerStart = '**'; break
            case 'italic': markerStart = '_'; break
            case 'strike': markerStart = '~~'; break
            case 'link':
                markerStart = '['
                markerEnd = '](https://example.com)'
                break
        }

        if (!markerEnd) {
            markerEnd = markerStart
        }
        markerStart = markerStart.split('')
        markerEnd = markerEnd.split('')

        end = input.selectionEnd + (markerStart.length)

        // Selected text on input
        const selected = input.value.substring(input.selectionStart, input.selectionEnd);

        // No text selected : add the tag name inside its marker
        if (selected.length === 0) {
            const arrayTag = tag.split('')
            markerStart = [...markerStart, ...arrayTag]
            end += arrayTag.length
        }
        else {
            // Selection already has tag : don't wrap it again
            if (selected.includes(markerStart.join('')) && selected.includes(markerEnd.join(''))) {
                updateValue = false
            }
        }

        // Wrap the value between tag markers
        if (updateValue) {
            value.splice(start, 0, ...markerStart)
            value.splice(end, 0, ...markerEnd)
        }
        value = value.join('')
    }

    // Focus input and select tag
    setTimeout(() => {
        input.focus()
        input.setSelectionRange(start, end + (markerEnd.length))
    }, 0)

    return value
}