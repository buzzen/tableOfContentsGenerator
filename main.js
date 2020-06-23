// BUG when applying on https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transforms/Using_CSS_transforms
// need to fix.

var anchor_no = 0; // to create id for headings that don't have a id attribute

function addTableOfContents() {
    // if table of contents already exist, return
    if (document.querySelector("ul.tableOfContents")) {
        return;
    }

    // create table of contents if it doesn't exist.
    let tableOfContents = document.createElement("div");
    tableOfContents.classList.add("tableOfContents");

    let headings = document.querySelectorAll("h2, h3, h4, h5, h6");
    let heading_names = [];
    headings.forEach(heading => {heading_names.push(heading.tagName)});
    let tableOfContentsLists = [];
    
    for (let i = 0; i < headings.length; i++) {
        let currentTagName = headings[i].tagName;
        let firstOfList = getFirstPosition(i, heading_names);
        if (firstOfList === null) {
            let new_list = document.createElement("ul");
            addToTable(new_list, headings[i]);
            tableOfContentsLists[i] = new_list;

            // append new list to parent list
            if (i > 0) {
                let parent_list = tableOfContentsLists[i - 1];
                if (parent_list === undefined) {
                    parent_list = tableOfContentsLists[getFirstPosition(i-1, heading_names)];
                }

                parent_list.appendChild(new_list);
            }
        } else {
            let parent_list = tableOfContentsLists[firstOfList];
            addToTable(parent_list, headings[i]);
        }
    }

    console.log(tableOfContentsLists);
    tableOfContents.appendChild(tableOfContentsLists[0]);
    let body = document.querySelector("body");
    body.prepend(tableOfContents);
}

function addToTable(list, heading_tag) {
    let item = document.createElement("li");
    let link = document.createElement("a");

    // create the link that references to corresponding heading,
    // create a new id if necessary
    let anchor = heading_tag.getAttribute("id");
    if (anchor) {
        link.setAttribute("href", "#" + anchor);
    } else {
        anchor = "whatever" + anchor_no++;
        heading_tag.setAttribute("id", anchor);
        link.setAttribute("href", "#" + anchor);
    }

    link.textContent = heading_tag.textContent;
    item.appendChild(link);
    list.appendChild(item);
}

// get the position of last heading that has the same heading name
// so you can put this heading in the same list
function getFirstPosition(child_pos, heading_names) {
    let childName = heading_names[child_pos];
    let firstOfKind = null;
    for (let i = child_pos - 1; i >= 0; i--) {
        if (heading_names[i] === childName) {
            firstOfKind = i;
            break;
        }
    }
    
    // set this to false if there are bigger headings in the middle
    let sameList = true; 

    let heading_numbers = [];
    heading_names.forEach(heading_name => heading_numbers.push(parseInt(heading_name[1])));
    for (let i = firstOfKind; i < child_pos; i++) {
        if (heading_numbers[i] < heading_numbers[child_pos]) {
            sameList = false;
        }
    }

    if (sameList) {
        return firstOfKind;
    } else {
        return null;
    }
}

addTableOfContents();