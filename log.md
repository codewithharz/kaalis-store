❯ clear
❯ npm run dev

> kaalis-store@1.0.0 dev
> concurrently -n "FE,BE,PROXY" -c "blue,green,yellow" "npm run dev:frontend" "npm run dev:backend" "npm run dev:proxy"

[PROXY] 
[PROXY] > kaalis-store@1.0.0 dev:proxy
[PROXY] > node vercel-dev.js
[PROXY] 
[FE] 
[FE] > kaalis-store@1.0.0 dev:frontend
[FE] > cd frontend && npm run dev
[FE] 
[BE] 
[BE] > kaalis-store@1.0.0 dev:backend
[BE] > cd backend && npm run dev
[BE] 
[BE] 
[BE] > backend@1.0.0 dev
[BE] > nodemon server.js
[BE] 
[FE] 
[FE] > kaalis-store@0.0.0 dev
[FE] > vite
[FE] 
[PROXY] 
[PROXY] === Development Environment ===
[PROXY] Main URL: http://localhost:3001
[PROXY] Frontend (Vite): http://localhost:5173
[PROXY] Backend: http://localhost:7788
[PROXY] API: http://localhost:3001/api
[PROXY] ===============================
[PROXY] 
[BE] [nodemon] 3.1.11
[BE] [nodemon] to restart at any time, enter `rs`
[BE] [nodemon] watching path(s): *.*
[BE] [nodemon] watching extensions: js,mjs,cjs,json
[BE] [nodemon] starting `node server.js`
[FE] 
[FE]   VITE v5.4.11  ready in 1050 ms
[FE] 
[FE]   ➜  Local:   http://localhost:5173/
[FE]   ➜  Network: use --host to expose
[BE] 2026-02-03 12:38:16 info: PayDunyaService initialized with test keys
[BE] 2026-02-03 12:38:16 info: OpayService initialized in TEST mode
[BE] 2026-02-03 12:38:16 info: OpayService initialized
[BE] 2026-02-03 12:38:16 info: PaystackService initialized
[BE] 2026-02-03 12:38:16 info: CurrencyService initialized with fixed exchange rates
[BE] 2026-02-03 12:38:16 info: MockPayoutServices initialized
[BE] 2026-02-03 12:38:16 info: PayoutService initialized. Using mock services: false
[BE] 2026-02-03 12:38:16 info: OpayService initialized in TEST mode
[BE] 2026-02-03 12:38:16 info: OpayService initialized
[BE] 2026-02-03 12:38:16 info: PayDunyaPayoutService initialized in test environment
[BE] 2026-02-03 12:38:16 warn: Orange Money API keys missing - service will be disabled
[BE] === ENVIRONMENT CHECK ===
[BE] NODE_ENV: development
[BE] PORT: 7788
[BE] FRONTEND_URL: http://localhost:5173
[BE] DATABASE Connected: Will check after connection
[BE] =========================
[BE] Attempting to connect to MongoDB...
[BE] MongoDB URI: mongodb+srv://vercel...
[BE] ✅ Payout test routes enabled in development mode
[BE] ℹ️  Automatic payout cron is disabled. Use manual processing via admin API.
[BE] ✅ Demo payment routes enabled
[BE] 🚀=========================🚀
[BE] 🚀 Server running on port 7788
[BE] 🚀 Environment: development
[BE] 🚀 Health check: http://localhost:7788/api/health
[BE] 🚀 CORS test: http://localhost:7788/api/cors-test
[BE] 🚀=========================🚀
[FE] Browserslist: browsers data (caniuse-lite) is 15 months old. Please run:
[FE]   npx update-browserslist-db@latest
[FE]   Why you should do it regularly: https://github.com/browserslist/update-db#readme
[BE] === CORS CHECK ===
[BE] Request origin: http://localhost:5173
[BE] Environment: development
[BE] Frontend URL env: http://localhost:5173
[BE] Allowed origins: [
[BE]   'http://localhost:5173',
[BE]   'http://localhost:3000',
[BE]   'http://127.0.0.1:5173',
[BE]   'http://127.0.0.1:3000',
[BE]   'https://www.bruthol.com',
[BE]   'https://bruthol.com',
[BE]   'http://localhost:5173',
[BE]   'http://127.0.0.1:5173',
[BE]   'http://localhost:3000',
[BE]   'http://localhost:5173',
[BE]   '/^https:\\/\\/kaalis-store[a-zA-Z0-9-]*\\.vercel\\.app$/',
[BE]   '/^https:\\/\\/[a-zA-Z0-9-]*kaalis[a-zA-Z0-9-]*\\.vercel\\.app$/',
[BE]   '/^https:\\/\\/kaalis-store-[a-zA-Z0-9-]*-[a-zA-Z0-9-]*\\.vercel\\.app$/'
[BE] ]
[BE] Origin allowed: true
[BE] ==================
[BE] Fetching categories...
[BE] Database not connected. State: 2
[BE] Error in getAllCategories: {
[BE]   message: 'Database connection not ready',
[BE]   stack: 'Error: Database connection not ready\n' +
[BE]     '    at exports.getAllCategories (/Users/harz/Downloads/Bruthol/kaalis-store/backend/controllers/categoryController.js:16:13)\n' +
[BE]     '    at Layer.handle [as handle_request] (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/layer.js:95:5)\n' +
[BE]     '    at next (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/route.js:149:13)\n' +
[BE]     '    at Route.dispatch (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/route.js:119:3)\n' +
[BE]     '    at Layer.handle [as handle_request] (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/layer.js:95:5)\n' +
[BE]     '    at /Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/index.js:284:15\n' +
[BE]     '    at Function.process_params (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/index.js:346:12)\n' +
[BE]     '    at next (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/index.js:280:10)\n' +
[BE]     '    at Function.handle (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/index.js:175:3)\n' +
[BE]     '    at router (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/index.js:47:12)',
[BE]   name: 'Error'
[BE] }
[BE] 2026-02-03 12:38:26 info: API Request:
[BE] 2026-02-03 12:38:26 warn: API Response:
[BE] === CORS CHECK ===
[BE] Request origin: http://localhost:5173
[BE] Environment: development
[BE] Frontend URL env: http://localhost:5173
[BE] Allowed origins: [
[BE]   'http://localhost:5173',
[BE]   'http://localhost:3000',
[BE]   'http://127.0.0.1:5173',
[BE]   'http://127.0.0.1:3000',
[BE]   'https://www.bruthol.com',
[BE]   'https://bruthol.com',
[BE]   'http://localhost:5173',
[BE]   'http://127.0.0.1:5173',
[BE]   'http://localhost:3000',
[BE]   'http://localhost:5173',
[BE]   '/^https:\\/\\/kaalis-store[a-zA-Z0-9-]*\\.vercel\\.app$/',
[BE]   '/^https:\\/\\/[a-zA-Z0-9-]*kaalis[a-zA-Z0-9-]*\\.vercel\\.app$/',
[BE]   '/^https:\\/\\/kaalis-store-[a-zA-Z0-9-]*-[a-zA-Z0-9-]*\\.vercel\\.app$/'
[BE] ]
[BE] Origin allowed: true
[BE] ==================
[BE] Fetching categories...
[BE] Database not connected. State: 2
[BE] Error in getAllCategories: {
[BE]   message: 'Database connection not ready',
[BE]   stack: 'Error: Database connection not ready\n' +
[BE]     '    at exports.getAllCategories (/Users/harz/Downloads/Bruthol/kaalis-store/backend/controllers/categoryController.js:16:13)\n' +
[BE]     '    at Layer.handle [as handle_request] (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/layer.js:95:5)\n' +
[BE]     '    at next (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/route.js:149:13)\n' +
[BE]     '    at Route.dispatch (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/route.js:119:3)\n' +
[BE]     '    at Layer.handle [as handle_request] (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/layer.js:95:5)\n' +
[BE]     '    at /Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/index.js:284:15\n' +
[BE]     '    at Function.process_params (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/index.js:346:12)\n' +
[BE]     '    at next (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/index.js:280:10)\n' +
[BE]     '    at Function.handle (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/index.js:175:3)\n' +
[BE]     '    at router (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/express/lib/router/index.js:47:12)',
[BE]   name: 'Error'
[BE] }
[BE] 2026-02-03 12:38:26 info: API Request:
[BE] 2026-02-03 12:38:26 warn: API Response:
[BE] Category index warning: Operation `categories.createIndex()` buffering timed out after 10000ms
[BE] === CORS CHECK ===
[BE] Request origin: http://localhost:5173
[BE] Environment: development
[BE] Frontend URL env: http://localhost:5173
[BE] Allowed origins: [
[BE]   'http://localhost:5173',
[BE]   'http://localhost:3000',
[BE]   'http://127.0.0.1:5173',
[BE]   'http://127.0.0.1:3000',
[BE]   'https://www.bruthol.com',
[BE]   'https://bruthol.com',
[BE]   'http://localhost:5173',
[BE]   'http://127.0.0.1:5173',
[BE]   'http://localhost:3000',
[BE]   'http://localhost:5173',
[BE]   '/^https:\\/\\/kaalis-store[a-zA-Z0-9-]*\\.vercel\\.app$/',
[BE]   '/^https:\\/\\/[a-zA-Z0-9-]*kaalis[a-zA-Z0-9-]*\\.vercel\\.app$/',
[BE]   '/^https:\\/\\/kaalis-store-[a-zA-Z0-9-]*-[a-zA-Z0-9-]*\\.vercel\\.app$/'
[BE] ]
[BE] Origin allowed: true
[BE] ==================
[BE] 2026-02-03 12:38:38 info: API Request:
[BE] Category index warning: Operation `categories.createIndex()` buffering timed out after 10000ms
[BE] Registration error: MongooseError: Operation `users.findOne()` buffering timed out after 10000ms
[BE]     at Timeout.<anonymous> (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/lib/drivers/node-mongodb-native/collection.js:185:23)
[BE]     at listOnTimeout (node:internal/timers:588:17)
[BE]     at process.processTimers (node:internal/timers:523:7)
[BE] 2026-02-03 12:38:48 warn: API Response:
[BE] === CORS CHECK ===
[BE] Request origin: http://localhost:5173
[BE] Environment: development
[BE] Frontend URL env: http://localhost:5173
[BE] Allowed origins: [
[BE]   'http://localhost:5173',
[BE]   'http://localhost:3000',
[BE]   'http://127.0.0.1:5173',
[BE]   'http://127.0.0.1:3000',
[BE]   'https://www.bruthol.com',
[BE]   'https://bruthol.com',
[BE]   'http://localhost:5173',
[BE]   'http://127.0.0.1:5173',
[BE]   'http://localhost:3000',
[BE]   'http://localhost:5173',
[BE]   '/^https:\\/\\/kaalis-store[a-zA-Z0-9-]*\\.vercel\\.app$/',
[BE]   '/^https:\\/\\/[a-zA-Z0-9-]*kaalis[a-zA-Z0-9-]*\\.vercel\\.app$/',
[BE]   '/^https:\\/\\/kaalis-store-[a-zA-Z0-9-]*-[a-zA-Z0-9-]*\\.vercel\\.app$/'
[BE] ]
[BE] Origin allowed: true
[BE] ==================
[BE] 2026-02-03 12:39:03 info: API Request:
[BE] === CORS CHECK ===
[BE] Request origin: http://localhost:5173
[BE] Environment: development
[BE] Frontend URL env: http://localhost:5173
[BE] Allowed origins: [
[BE]   'http://localhost:5173',
[BE]   'http://localhost:3000',
[BE]   'http://127.0.0.1:5173',
[BE]   'http://127.0.0.1:3000',
[BE]   'https://www.bruthol.com',
[BE]   'https://bruthol.com',
[BE]   'http://localhost:5173',
[BE]   'http://127.0.0.1:5173',
[BE]   'http://localhost:3000',
[BE]   'http://localhost:5173',
[BE]   '/^https:\\/\\/kaalis-store[a-zA-Z0-9-]*\\.vercel\\.app$/',
[BE]   '/^https:\\/\\/[a-zA-Z0-9-]*kaalis[a-zA-Z0-9-]*\\.vercel\\.app$/',
[BE]   '/^https:\\/\\/kaalis-store-[a-zA-Z0-9-]*-[a-zA-Z0-9-]*\\.vercel\\.app$/'
[BE] ]
[BE] Origin allowed: true
[BE] ==================
[BE] 2026-02-03 12:39:06 info: API Request:
[BE] Login error: MongooseError: Operation `users.findOne()` buffering timed out after 10000ms
[BE]     at Timeout.<anonymous> (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/lib/drivers/node-mongodb-native/collection.js:185:23)
[BE]     at listOnTimeout (node:internal/timers:588:17)
[BE]     at process.processTimers (node:internal/timers:523:7)
[BE] 2026-02-03 12:39:13 warn: API Response:
[BE] Login error: MongooseError: Operation `users.findOne()` buffering timed out after 10000ms
[BE]     at Timeout.<anonymous> (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/lib/drivers/node-mongodb-native/collection.js:185:23)
[BE]     at listOnTimeout (node:internal/timers:588:17)
[BE]     at process.processTimers (node:internal/timers:523:7)
[BE] 2026-02-03 12:39:16 warn: API Response:
[BE] MongoDB disconnected
[BE] MongoDB disconnected
[BE] MongoDB Connection Error Details: {
[BE]   message: 'Server selection timed out after 60000 ms',
[BE]   code: undefined,
[BE]   name: 'MongooseServerSelectionError',
[BE]   stack: 'MongooseServerSelectionError: Server selection timed out after 60000 ms\n' +
[BE]     '    at _handleConnectionErrors (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/lib/connection.js:909:11)\n' +
[BE]     '    at NativeConnection.openUri (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/lib/connection.js:860:11)\n' +
[BE]     '    at async connectDB (/Users/harz/Downloads/Bruthol/kaalis-store/backend/utils/db.js:37:18)\n' +
[BE]     '    at async initializeApp (/Users/harz/Downloads/Bruthol/kaalis-store/backend/server.js:262:5)'
[BE] }
[BE] ❌ Failed to initialize app: MongooseServerSelectionError: Server selection timed out after 60000 ms
[BE]     at _handleConnectionErrors (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/lib/connection.js:909:11)
[BE]     at NativeConnection.openUri (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/lib/connection.js:860:11)
[BE]     at async connectDB (/Users/harz/Downloads/Bruthol/kaalis-store/backend/utils/db.js:37:18)
[BE]     at async initializeApp (/Users/harz/Downloads/Bruthol/kaalis-store/backend/server.js:262:5) {
[BE]   reason: TopologyDescription {
[BE]     type: 'ReplicaSetNoPrimary',
[BE]     servers: Map(3) {
[BE]       'ac-rpfoqvb-shard-00-02.vjpyvzz.mongodb.net:27017' => [ServerDescription],
[BE]       'ac-rpfoqvb-shard-00-00.vjpyvzz.mongodb.net:27017' => [ServerDescription],
[BE]       'ac-rpfoqvb-shard-00-01.vjpyvzz.mongodb.net:27017' => [ServerDescription]
[BE]     },
[BE]     stale: false,
[BE]     compatible: true,
[BE]     heartbeatFrequencyMS: 10000,
[BE]     localThresholdMS: 15,
[BE]     setName: 'atlas-gty2sf-shard-0',
[BE]     maxElectionId: null,
[BE]     maxSetVersion: null,
[BE]     commonWireVersion: 0,
[BE]     logicalSessionTimeoutMinutes: 30
[BE]   },
[BE]   code: undefined
[BE] }
[BE] MongoDB error: MongoServerSelectionError: Server selection timed out after 60000 ms
[BE]     at Topology.selectServer (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/node_modules/mongodb/lib/sdam/topology.js:303:38)
[BE]     at async Topology._connect (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/node_modules/mongodb/lib/sdam/topology.js:196:28)
[BE]     at async Topology.connect (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/node_modules/mongodb/lib/sdam/topology.js:158:13)
[BE]     at async topologyConnect (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/node_modules/mongodb/lib/mongo_client.js:223:17)
[BE]     at async MongoClient._connect (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/node_modules/mongodb/lib/mongo_client.js:236:13)
[BE]     at async MongoClient.connect (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/node_modules/mongodb/lib/mongo_client.js:161:13)
[BE]     at async NativeConnection.createClient (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/lib/drivers/node-mongodb-native/connection.js:320:3)
[BE]     at async NativeConnection.openUri (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/lib/connection.js:858:5)
[BE]     at async connectDB (/Users/harz/Downloads/Bruthol/kaalis-store/backend/utils/db.js:37:18)
[BE]     at async initializeApp (/Users/harz/Downloads/Bruthol/kaalis-store/backend/server.js:262:5) {
[BE]   reason: TopologyDescription {
[BE]     type: 'ReplicaSetNoPrimary',
[BE]     servers: Map(3) {
[BE]       'ac-rpfoqvb-shard-00-02.vjpyvzz.mongodb.net:27017' => [ServerDescription],
[BE]       'ac-rpfoqvb-shard-00-00.vjpyvzz.mongodb.net:27017' => [ServerDescription],
[BE]       'ac-rpfoqvb-shard-00-01.vjpyvzz.mongodb.net:27017' => [ServerDescription]
[BE]     },
[BE]     stale: false,
[BE]     compatible: true,
[BE]     heartbeatFrequencyMS: 10000,
[BE]     localThresholdMS: 15,
[BE]     setName: 'atlas-gty2sf-shard-0',
[BE]     maxElectionId: null,
[BE]     maxSetVersion: null,
[BE]     commonWireVersion: 0,
[BE]     logicalSessionTimeoutMinutes: 30
[BE]   },
[BE]   code: undefined,
[BE]   [Symbol(errorLabels)]: Set(0) {}
[BE] }
[BE] MongoDB connection error: MongoServerSelectionError: Server selection timed out after 60000 ms
[BE]     at Topology.selectServer (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/node_modules/mongodb/lib/sdam/topology.js:303:38)
[BE]     at async Topology._connect (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/node_modules/mongodb/lib/sdam/topology.js:196:28)
[BE]     at async Topology.connect (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/node_modules/mongodb/lib/sdam/topology.js:158:13)
[BE]     at async topologyConnect (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/node_modules/mongodb/lib/mongo_client.js:223:17)
[BE]     at async MongoClient._connect (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/node_modules/mongodb/lib/mongo_client.js:236:13)
[BE]     at async MongoClient.connect (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/node_modules/mongodb/lib/mongo_client.js:161:13)
[BE]     at async NativeConnection.createClient (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/lib/drivers/node-mongodb-native/connection.js:320:3)
[BE]     at async NativeConnection.openUri (/Users/harz/Downloads/Bruthol/kaalis-store/node_modules/mongoose/lib/connection.js:858:5)
[BE]     at async connectDB (/Users/harz/Downloads/Bruthol/kaalis-store/backend/utils/db.js:37:18)
[BE]     at async initializeApp (/Users/harz/Downloads/Bruthol/kaalis-store/backend/server.js:262:5) {
[BE]   reason: TopologyDescription {
[BE]     type: 'ReplicaSetNoPrimary',
[BE]     servers: Map(3) {
[BE]       'ac-rpfoqvb-shard-00-02.vjpyvzz.mongodb.net:27017' => [ServerDescription],
[BE]       'ac-rpfoqvb-shard-00-00.vjpyvzz.mongodb.net:27017' => [ServerDescription],
[BE]       'ac-rpfoqvb-shard-00-01.vjpyvzz.mongodb.net:27017' => [ServerDescription]
[BE]     },
[BE]     stale: false,
[BE]     compatible: true,
[BE]     heartbeatFrequencyMS: 10000,
[BE]     localThresholdMS: 15,
[BE]     setName: 'atlas-gty2sf-shard-0',
[BE]     maxElectionId: null,
[BE]     maxSetVersion: null,
[BE]     commonWireVersion: 0,
[BE]     logicalSessionTimeoutMinutes: 30
[BE]   },
[BE]   code: undefined,
[BE]   [Symbol(errorLabels)]: Set(0) {}
[BE] }
