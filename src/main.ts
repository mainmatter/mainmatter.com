import Application, { DOMBuilder, RehydratingBuilder, RuntimeCompilerLoader, SyncRenderer } from '@glimmer/application';
import Resolver, { BasicModuleRegistry } from '@glimmer/resolver';
import moduleMap from '../config/module-map';
import resolverConfiguration from '../config/resolver-configuration';


export default class App extends Application {
  public appName: string;

  constructor(options = { hasSSRBody: false, element: null }) {
    let moduleRegistry = new BasicModuleRegistry(moduleMap);
    let resolver = new Resolver(resolverConfiguration, moduleRegistry);

    const BuilderType = options.hasSSRBody ? RehydratingBuilder : DOMBuilder;

    super({
      builder: new BuilderType({ element: options.element, nextSibling: null }),
      loader: new RuntimeCompilerLoader(resolver),
      renderer: new SyncRenderer(),
      resolver,
      rootName: resolverConfiguration.app.rootName,
    });
  }
}
