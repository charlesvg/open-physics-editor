

export async function getComponent(filename, replaceObject) {
    const response = await fetch(filename);
    const body = await response.text();
    return mustache(body, replaceObject);
}

export async function rdr(component) {
    let filename = component.filename;
    let selector = component.selector;
    let state = component.state;
    let html = await getComponent(filename,state);
    document.querySelector(selector).insertAdjacentHTML('beforeend', html);
}
export function cbk(selector, eventType, callback ) {
    document.querySelector(selector).addEventListener(eventType, callback);
}

// From https://gist.github.com/jimeh/332765
const mustache = (string, data) => {
    return Object.entries(data).reduce((res, [key, value]) => {
        // lookbehind expression, only replaces if mustache was not preceded by a backslash
        const mainRe = new RegExp(`(?<!\\\\){{\\s*${key}\\s*}}`, 'g')
        // this regex is actually (?<!\\){{\s*<key>\s*}} but because of escaping it looks like that...
        const escapeRe = new RegExp(`\\\\({{\\s*${key}\\s*}})`, 'g')
        // the second regex now handles the cases that were skipped in the first case.
        return res.replace(mainRe, value.toString()).replace(escapeRe, '$1');
    }, string);
}
// const data  = {name: "James", location: "Mars"};
// // note that the double backslash is only since this is a JS string constant
// mustache("Welcome to \\{{ location }}, {{ name }}.", data);
// // result: "Welcome to {{ location }}, James."