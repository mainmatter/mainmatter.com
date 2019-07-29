export default class HeadTags {


  public static create(): HeadTags {
    return new HeadTags();
  }
  private document: HTMLDocument = window.document;

  public write(tagName, keyAttrs = {}, contentAttrs = {}, textContent = null) {
    let element = this.getElement(tagName, keyAttrs, contentAttrs);

    let attrs = {
      ...keyAttrs,
      ...contentAttrs
    };
    for (let attr in attrs) {
      element.setAttribute(attr, attrs[attr]);
    }
    if (textContent) {
      element.textContent = textContent;
    }

    this.document.head.appendChild(element);
  }

  private getElement(tagName, keyAttrs): Element {
    let selector = buildSelector(tagName, keyAttrs);
    let element = this.document.querySelector(selector);
    if (!element) {
      element = this.document.createElement(tagName);
    }
    return element;
  }
}

function buildSelector(tagName, attrs): string {
  let selector = `head > ${tagName}`;
  if (Object.keys(attrs).length > 0) {
    let attrSelectors = Object.keys(attrs).map((attr) => `[${attr}="${attrs[attr]}"]`);
    selector = `${selector}${attrSelectors.join('')}`;
  }
  return selector;
}
