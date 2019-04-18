// tslint:disable-next-line:no-var-requires
const SimpleDOM = require('simple-dom');
const Document = SimpleDOM.Document;
import { DOMBuilder, RuntimeCompilerLoader, SyncRenderer } from '@glimmer/application';
import Resolver, { BasicModuleRegistry } from '@glimmer/resolver';
import { SerializingBuilder } from '@glimmer/ssr';
import moduleMap from '../config/module-map';
import resolverConfiguration from '../config/resolver-configuration';

import SSRApplication from './ssr-application';

let moduleRegistry = new BasicModuleRegistry(moduleMap);
let resolver = new Resolver(resolverConfiguration, moduleRegistry);
let loader = new RuntimeCompilerLoader(resolver);

export default class GlimmerRenderer {

  // tslint:disable-next-line:no-empty
  constructor() {}

  render(origin: string, route: string): Promise<string> {
    const document = new Document();

    const mountEl = document.createElement('div');
    mountEl.setAttribute('id', 'app');
    document.body.appendChild(mountEl);
    let renderer = new SyncRenderer();
    let builder = new SerializingBuilder({ element: document.body as any as Element, nextSibling: null });

    const app = new SSRApplication({
      rootName: 'simplabs',
      loader,
      builder,
      document,
      renderer,
      resolver,
      route,
      origin,
      element: mountEl,
    });

    return app.renderToString();
  }
}
