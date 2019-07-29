export default class HeadTags {


  public static create(): HeadTags {
    return new HeadTags();
  }
  private document: HTMLDocument = window.document;

  public write(tagName, keyAttrs = {}, contentAttrs = {}, textContent = null) {
    let element = this.getElement(tagName, keyAttrs, contentAttrs);
    if (textContent) {
      element.textContent = textContent;
    }
    this.document.head.appendChild(element);
  }

  private getElement(tagName, keyAttrs, contentAttrs): Element {
    let selector = buildSelector(tagName, keyAttrs);
    let element = this.document.querySelector(selector);
    if (!element) {
      let attrs = {
        ...keyAttrs,
        ...contentAttrs
      };
      this.document.createElement(tagName, attrs);
    }
    return element;
  }
}

function buildSelector(tagName, attrs): string {
  let selector = `head > ${tagName}`;
  if (Object.keys(attrs).length > 0) {
    let attrSelectors = attrs.map((attr) => `[${attr}="${attrs[attr]}"]`);
    selector = `${selector}${attrSelectors};`
  }
  return selector;
}
