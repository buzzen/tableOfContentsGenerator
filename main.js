var headings = document.querySelectorAll("h2, h3, h4, h5, h6");

var tableOfContents = document.createElement("ul");

var anchor_no = 0; // to create id for headings that don't have a id attribute
for (var i = 0; i < headings.length; i++) {
    let currentTagName = headings[i].tagName;
    let previousTagName = null;
    if (i !== 0) previousTagName = headings[i-1].tagName;

    if (currentTagName === "H2") {
        createLink(tableOfContents, headings[i]);        
    } else if (currentTagName === "H3") {
        if (previousTagName === "H2") {
            var h3_list = document.createElement("ul");
            tableOfContents.appendChild(h3_list);
        }

        createLink(h3_list, headings[i]);
    }

    /* case of h4 h5 h6 */
}

var body = document.querySelector("body");
body.prepend(tableOfContents);

function createLink(parent, current) {
    let item = document.createElement("li");
    let link = document.createElement("a");

    // create the link that references to corresponding heading,
    // create a new id if necessary
    let anchor = current.getAttribute("id");
    if (anchor) {
        link.setAttribute("href", "#" + anchor);
    } else {
        anchor = "whatever" + anchor_no++;
        current.setAttribute("id", anchor);
        link.setAttribute("href", "#" + anchor);
    }

    link.textContent = current.textContent;
    item.appendChild(link);
    parent.appendChild(item);
}