17:01:48.696 Running build in Washington, D.C., USA (East) – iad1
17:01:48.701 Build machine configuration: 2 cores, 8 GB
17:01:48.989 Cloning github.com/codewithharz/kaalis-store (Branch: master, Commit: f01fa5f)
17:01:48.990 Previous build caches not available.
17:01:49.823 Cloning completed: 834.000ms
17:01:50.629 Running "vercel build"
17:01:51.043 Vercel CLI 50.1.6
17:01:52.894 Running "install" command: `npm install --prefix=..`...
17:01:56.519 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
17:01:56.820 npm warn deprecated npmlog@5.0.1: This package is no longer supported.
17:01:57.148 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
17:01:57.521 npm warn deprecated gauge@3.0.2: This package is no longer supported.
17:01:58.011 npm warn deprecated are-we-there-yet@2.0.0: This package is no longer supported.
17:01:59.313 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
17:03:24.820 
17:03:24.822 added 687 packages, and audited 690 packages in 2m
17:03:24.822 
17:03:24.822 89 packages are looking for funding
17:03:24.822   run `npm fund` for details
17:03:25.490 
17:03:25.490 29 vulnerabilities (3 low, 14 moderate, 10 high, 2 critical)
17:03:25.490 
17:03:25.490 To address issues that do not require attention, run:
17:03:25.490   npm audit fix
17:03:25.490 
17:03:25.491 To address all issues (including breaking changes), run:
17:03:25.491   npm audit fix --force
17:03:25.491 
17:03:25.491 Run `npm audit` for details.
17:03:25.779 
17:03:25.779 > kaalis-store@0.0.0 build
17:03:25.780 > vite build
17:03:25.780 
17:03:25.972 [31mfailed to load config from /vercel/path0/frontend/vite.config.js[39m
17:03:25.973 [31merror during build:
17:03:25.973 Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@vitejs/plugin-vue' imported from /vercel/path0/frontend/vite.config.js.timestamp-1767888205965-cdea4bb1569cf.mjs
17:03:25.973     at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)
17:03:25.973     at packageResolve (node:internal/modules/esm/resolve:768:81)
17:03:25.974     at moduleResolve (node:internal/modules/esm/resolve:858:18)
17:03:25.974     at defaultResolve (node:internal/modules/esm/resolve:990:11)
17:03:25.974     at #cachedDefaultResolve (node:internal/modules/esm/loader:718:20)
17:03:25.974     at #resolveAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:735:38)
17:03:25.974     at ModuleLoader.resolveSync (node:internal/modules/esm/loader:764:52)
17:03:25.974     at #resolve (node:internal/modules/esm/loader:700:17)
17:03:25.974     at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:620:35)
17:03:25.974     at ModuleJob.syncLink (node:internal/modules/esm/module_job:143:33)[39m
17:03:25.982 npm error Lifecycle script `build` failed with error:
17:03:25.982 npm error code 1
17:03:25.983 npm error path /vercel/path0/frontend
17:03:25.983 npm error workspace kaalis-store@0.0.0
17:03:25.983 npm error location /vercel/path0/frontend
17:03:25.983 npm error command failed
17:03:25.983 npm error command sh -c vite build
17:03:25.992 Error: Command "npm run build" exited with 1