// tslint:disable-next-line:no-var-requires
const SimpleDOM = require('simple-dom');

export default class SSRHeadTags {
  private document: SimpleDOM.Document;

  constructor(options) {
    this.document = options.document;
  }

  public static create(options): SSRHeadTags {
    return new SSRHeadTags(options);
  }

  public write(tagName, keyAttrs = {}, contentAttrs = {}, textContent = null) {
    let element = this.document.createElement(tagName);
    
    let attrs = {
      ...keyAttrs,
      ...contentAttrs
    };
    for (let attr in attrs) {
      element.setAttribute(attr, attrs[attr]);
    }

    if (textContent) {
      let text = this.document.createTextNode(textContent);
      element.appendChild(text);
    }

    this.document.head.appendChild(element);
  }
  }
}
