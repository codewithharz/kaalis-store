16:54:48.988 Running build in Washington, D.C., USA (East) – iad1
16:54:48.989 Build machine configuration: 2 cores, 8 GB
16:54:49.228 Cloning github.com/codewithharz/kaalis-store (Branch: master, Commit: a7ccca8)
16:54:49.229 Previous build caches not available.
16:54:49.899 Cloning completed: 671.000ms
16:54:50.828 Running "vercel build"
16:54:51.237 Vercel CLI 50.1.6
16:54:51.850 Running "install" command: `npm install --prefix=..`...
16:54:55.314 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
16:54:55.406 npm warn deprecated npmlog@5.0.1: This package is no longer supported.
16:54:55.769 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
16:54:56.153 npm warn deprecated gauge@3.0.2: This package is no longer supported.
16:54:56.593 npm warn deprecated are-we-there-yet@2.0.0: This package is no longer supported.
16:54:57.548 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
16:56:19.373 
16:56:19.374 added 672 packages, and audited 675 packages in 1m
16:56:19.375 
16:56:19.375 83 packages are looking for funding
16:56:19.375   run `npm fund` for details
16:56:20.022 
16:56:20.023 27 vulnerabilities (3 low, 12 moderate, 10 high, 2 critical)
16:56:20.024 
16:56:20.025 To address issues that do not require attention, run:
16:56:20.025   npm audit fix
16:56:20.025 
16:56:20.025 To address all issues (including breaking changes), run:
16:56:20.025   npm audit fix --force
16:56:20.026 
16:56:20.028 Run `npm audit` for details.
16:56:20.322 
16:56:20.325 > kaalis-store@0.0.0 build
16:56:20.325 > vite build
16:56:20.325 
16:56:20.329 sh: line 1: vite: command not found
16:56:20.332 npm error Lifecycle script `build` failed with error:
16:56:20.335 npm error code 127
16:56:20.335 npm error path /vercel/path0/frontend
16:56:20.335 npm error workspace kaalis-store@0.0.0
16:56:20.335 npm error location /vercel/path0/frontend
16:56:20.335 npm error command failed
16:56:20.337 npm error command sh -c vite build
16:56:20.342 Error: Command "npm run build" exited with 127