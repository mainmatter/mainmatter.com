import DynamicScope from './dynamic-scope';
import SSRComponentManager from './ssr-component-manager';
import SSRDOMTreeConstruction from './ssr-dom-tree-construction';
import SSRHeadTags from './ssr-head-tags';
import hash from '../src/utils/helpers/hash';

import { classnames } from '@css-blocks/glimmer/dist/cjs/src/helpers/classnames';
import { concat } from '@css-blocks/glimmer/dist/cjs/src/helpers/concat';
import { UpdatableReference } from '@glimmer/component';
import { TemplateIterator } from '@glimmer/runtime';

// tslint:disable-next-line:no-var-requires
const SimpleDOM = require('simple-dom');
// tslint:disable-next-line:no-var-requires
const routesMap = require('./routes.json');

import Application, { ApplicationOptions } from '@glimmer/application';

export interface SSROptions extends ApplicationOptions {
  element: any;
  route: string;
  origin: string;
}

export default class SSRApplication extends Application {
  serializer = new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap);
  mainLayout: any;
  element: any;

  constructor(options: SSROptions) {
    super(options);

    // tslint:disable-next-line:max-classes-per-file
    class AppState {

      static create() {
        return new AppState();
      }

      isSSR: boolean;
      route: string;
      origin: string;
      routesMap: IRoutesMap;

      constructor() {
        this.isSSR = true;
        this.route = options.route;
        this.origin = options.origin;
        this.routesMap = routesMap;
      }
    }

    let rootName = 'simplabs';
    this.element = options.element;
    this.registerInitializer({
      initialize(registry) {
        registry._resolver.registry._entries[
          `helper:/${rootName}/components/-css-blocks-classnames`
        ] = classnames;
        registry._resolver.registry._entries[
          `helper:/${rootName}/components/-css-blocks-concat`
        ] = concat;

        registry._resolver.registry._entries[
          `helper:/${rootName}/components/hash`
        ] = hash;

        // inject appendOperations into environment in order to get working createElement and setAttribute.
        registry.register(
          `domTreeConstruction:/${rootName}/main/main`,
          SSRDOMTreeConstruction
        );
        registry.registerInjection(
          'domTreeConstruction',
          'document',
          `document:/${rootName}/main/main`
        );
        registry.registerInjection(
          'environment',
          'appendOperations',
          `domTreeConstruction:/${rootName}/main/main`
        );
        registry.register(
          `app-state:/${rootName}/main/main`,
          AppState
        );
        registry.registerInjection(
          `component:/${rootName}/components/Simplabs`,
          'appState',
          `app-state:/${rootName}/main/main`
        );
        registry.registerInjection(
          `component:/${rootName}/components/Simplabs`,
          'document',
          `document:/${rootName}/main/main`
        );
        registry.register(
          `component-manager:/${rootName}/component-managers/main`,
          SSRComponentManager
        );
        registry.register(
          `utils:/${rootName}/head-tags/main`,
          SSRHeadTags
        );
        registry.registerInjection(
          `utils:/${rootName}/head-tags/main`,
          'document',
          `document:/${rootName}/main/main`
        );
        registry.registerInjection(
          `component`,
          'headTags',
          `utils:/${rootName}/head-tags/main`,
        );
      },
    });
    this.initialize();
    this.env = this.lookup(`environment:/${this.rootName}/main/main`);
  }

  // tslint:disable-next-line:no-empty
  scheduleRerender() {}

  async renderToString(): Promise<{ body: string, title: string }> {
    let { env } = this;

    let builder = this.builder.getBuilder(env);
    let dynamicScope = new DynamicScope();
    let templateIterator: TemplateIterator;
    let self = new UpdatableReference({
      roots: [{id: 1, component: 'Simplabs', parent: this.element, nextSibling: null}]
    });

    try {
      templateIterator = await this.loader.getTemplateIterator(this, env, builder, dynamicScope as any, self);
    } catch (err) {
      this._didError(err);
      throw err;
    }

    try {
      this.boot();
      // Begin a new transaction. The transaction stores things like component
      // lifecycle events so they can be flushed once rendering has completed.
      env.begin();
      await this.renderer.render(templateIterator);
      // commit the transaction and flush component lifecycle hooks.
      env.commit();
    } catch (err) {
      this._didError(err);
      throw err;
    }

    let document = this.document as any;
    return {
      body: this.serializer.serializeChildren(document.body) as string,
      head: this.serializer.serializeChildren(document.head) as string
    };
  }
}
