Ups/izmir/kaalis-store/backend/controllers/orderController.js:257:19) {
[BE]   stringValue: '"0000bx-mobhfjky"',
[BE]   messageFormat: undefined,
[BE]   kind: 'ObjectId',
[BE]   value: '0000bx-mobhfjky',
[BE]   path: '_id',
[BE]   reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
[BE]       at new ObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/bson/lib/bson.cjs:2517:23)
[BE]       at castObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast/objectid.js:25:12)
[BE]       at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:248:12)
[BE]       at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]       at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]       at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]       at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]       at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]       at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]       at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80),
[BE]   valueType: 'string'
[BE] }
[BE] User found: Yes
[BE] Auth successful for user: testuser@example.com
[BE] === AUTH DEBUG END ===
[BE] Error fetching order: CastError: Cast to ObjectId failed for value "0000bs-mob0q2yi" (type string) at path "_id" for model "Order"
[BE]     at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:250:11)
[BE]     at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]     at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]     at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]     at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]     at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]     at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]     at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80)
[BE]     at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
[BE]     at async getOrderById (/Users/harz/Documents/backUps/izmir/kaalis-store/backend/controllers/orderController.js:257:19) {
[BE]   stringValue: '"0000bs-mob0q2yi"',
[BE]   messageFormat: undefined,
[BE]   kind: 'ObjectId',
[BE]   value: '0000bs-mob0q2yi',
[BE]   path: '_id',
[BE]   reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
[BE]       at new ObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/bson/lib/bson.cjs:2517:23)
[BE]       at castObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast/objectid.js:25:12)
[BE]       at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:248:12)
[BE]       at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]       at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]       at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]       at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]       at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]       at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]       at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80),
[BE]   valueType: 'string'
[BE] }
[BE] User found: Yes
[BE] Auth successful for user: testuser@example.com
[BE] === AUTH DEBUG END ===
[BE] Error fetching order: CastError: Cast to ObjectId failed for value "0000bw-mobg9ayo" (type string) at path "_id" for model "Order"
[BE]     at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:250:11)
[BE]     at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]     at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]     at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]     at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]     at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]     at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]     at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80)
[BE]     at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
[BE]     at async getOrderById (/Users/harz/Documents/backUps/izmir/kaalis-store/backend/controllers/orderController.js:257:19) {
[BE]   stringValue: '"0000bw-mobg9ayo"',
[BE]   messageFormat: undefined,
[BE]   kind: 'ObjectId',
[BE]   value: '0000bw-mobg9ayo',
[BE]   path: '_id',
[BE]   reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
[BE]       at new ObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/bson/lib/bson.cjs:2517:23)
[BE]       at castObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast/objectid.js:25:12)
[BE]       at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:248:12)
[BE]       at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]       at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]       at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]       at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]       at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]       at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]       at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80),
[BE]   valueType: 'string'
[BE] }
[BE] 2026-04-23 19:52:22 info: API Request:
[BE] 2026-04-23 19:52:22 warn: API Response:
[BE] 2026-04-23 19:52:22 warn: API Response:
[BE] 2026-04-23 19:52:22 warn: API Response:
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
[BE] === AUTH DEBUG ===
[BE] Auth Header: Present
[BE] Token extracted: Yes
[BE] Token preview: eyJhbGciOiJIUzI1NiIs...
[BE] JWT_SECRET exists: true
[BE] Token decoded successfully: {
[BE]   userId: '6696945dabbb289ecc6c2d15',
[BE]   iat: 1776956837,
[BE]   exp: 1777043237
[BE] }
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
[BE] === AUTH DEBUG ===
[BE] Auth Header: Present
[BE] Token extracted: Yes
[BE] Token preview: eyJhbGciOiJIUzI1NiIs...
[BE] JWT_SECRET exists: true
[BE] Token decoded successfully: {
[BE]   userId: '6696945dabbb289ecc6c2d15',
[BE]   iat: 1776956837,
[BE]   exp: 1777043237
[BE] }
[BE] User found: Yes
[BE] Auth successful for user: testuser@example.com
[BE] === AUTH DEBUG END ===
[BE] Error fetching order: CastError: Cast to ObjectId failed for value "0000bn-moaxcmgu" (type string) at path "_id" for model "Order"
[BE]     at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:250:11)
[BE]     at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]     at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]     at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]     at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]     at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]     at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]     at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80)
[BE]     at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
[BE]     at async getOrderById (/Users/harz/Documents/backUps/izmir/kaalis-store/backend/controllers/orderController.js:257:19) {
[BE]   stringValue: '"0000bn-moaxcmgu"',
[BE]   messageFormat: undefined,
[BE]   kind: 'ObjectId',
[BE]   value: '0000bn-moaxcmgu',
[BE]   path: '_id',
[BE]   reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
[BE]       at new ObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/bson/lib/bson.cjs:2517:23)
[BE]       at castObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast/objectid.js:25:12)
[BE]       at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:248:12)
[BE]       at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]       at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]       at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]       at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]       at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]       at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]       at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80),
[BE]   valueType: 'string'
[BE] }
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
[BE] === AUTH DEBUG ===
[BE] Auth Header: Present
[BE] Token extracted: Yes
[BE] Token preview: eyJhbGciOiJIUzI1NiIs...
[BE] JWT_SECRET exists: true
[BE] Token decoded successfully: {
[BE]   userId: '6696945dabbb289ecc6c2d15',
[BE]   iat: 1776956837,
[BE]   exp: 1777043237
[BE] }
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
[BE] === AUTH DEBUG ===
[BE] Auth Header: Present
[BE] Token extracted: Yes
[BE] Token preview: eyJhbGciOiJIUzI1NiIs...
[BE] JWT_SECRET exists: true
[BE] Token decoded successfully: {
[BE]   userId: '6696945dabbb289ecc6c2d15',
[BE]   iat: 1776956837,
[BE]   exp: 1777043237
[BE] }
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
[BE] 2026-04-23 19:52:22 info: API Request:
[BE] 2026-04-23 19:52:22 info: API Request:
[BE] 2026-04-23 19:52:22 warn: API Response:
[BE] 2026-04-23 19:52:22 info: API Request:
[BE] 2026-04-23 19:52:22 info: API Request:
[BE] User found: Yes
[BE] Auth successful for user: testuser@example.com
[BE] === AUTH DEBUG END ===
[BE] Error fetching order: CastError: Cast to ObjectId failed for value "0000bu-mob1bbwa" (type string) at path "_id" for model "Order"
[BE]     at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:250:11)
[BE]     at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]     at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]     at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]     at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]     at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]     at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]     at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80)
[BE]     at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
[BE]     at async getOrderById (/Users/harz/Documents/backUps/izmir/kaalis-store/backend/controllers/orderController.js:257:19) {
[BE]   stringValue: '"0000bu-mob1bbwa"',
[BE]   messageFormat: undefined,
[BE]   kind: 'ObjectId',
[BE]   value: '0000bu-mob1bbwa',
[BE]   path: '_id',
[BE]   reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
[BE]       at new ObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/bson/lib/bson.cjs:2517:23)
[BE]       at castObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast/objectid.js:25:12)
[BE]       at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:248:12)
[BE]       at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]       at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]       at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]       at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]       at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]       at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]       at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80),
[BE]   valueType: 'string'
[BE] }
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
[BE] === AUTH DEBUG ===
[BE] Auth Header: Present
[BE] Token extracted: Yes
[BE] Token preview: eyJhbGciOiJIUzI1NiIs...
[BE] JWT_SECRET exists: true
[BE] Token decoded successfully: {
[BE]   userId: '6696945dabbb289ecc6c2d15',
[BE]   iat: 1776956837,
[BE]   exp: 1777043237
[BE] }
[BE] User found: Yes
[BE] Auth successful for user: testuser@example.com
[BE] === AUTH DEBUG END ===
[BE] Error fetching order: CastError: Cast to ObjectId failed for value "0000bv-mob1kkwe" (type string) at path "_id" for model "Order"
[BE]     at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:250:11)
[BE]     at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]     at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]     at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]     at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]     at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]     at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]     at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80)
[BE]     at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
[BE]     at async getOrderById (/Users/harz/Documents/backUps/izmir/kaalis-store/backend/controllers/orderController.js:257:19) {
[BE]   stringValue: '"0000bv-mob1kkwe"',
[BE]   messageFormat: undefined,
[BE]   kind: 'ObjectId',
[BE]   value: '0000bv-mob1kkwe',
[BE]   path: '_id',
[BE]   reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
[BE]       at new ObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/bson/lib/bson.cjs:2517:23)
[BE]       at castObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast/objectid.js:25:12)
[BE]       at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:248:12)
[BE]       at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]       at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]       at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]       at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]       at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]       at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]       at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80),
[BE]   valueType: 'string'
[BE] }
[BE] User found: Yes
[BE] Auth successful for user: testuser@example.com
[BE] === AUTH DEBUG END ===
[BE] Error fetching order: CastError: Cast to ObjectId failed for value "0000bk-mn21osd0" (type string) at path "_id" for model "Order"
[BE]     at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:250:11)
[BE]     at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]     at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]     at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]     at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]     at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]     at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]     at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80)
[BE]     at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
[BE]     at async getOrderById (/Users/harz/Documents/backUps/izmir/kaalis-store/backend/controllers/orderController.js:257:19) {
[BE]   stringValue: '"0000bk-mn21osd0"',
[BE]   messageFormat: undefined,
[BE]   kind: 'ObjectId',
[BE]   value: '0000bk-mn21osd0',
[BE]   path: '_id',
[BE]   reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
[BE]       at new ObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/bson/lib/bson.cjs:2517:23)
[BE]       at castObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast/objectid.js:25:12)
[BE]       at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:248:12)
[BE]       at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]       at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]       at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]       at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]       at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]       at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]       at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80),
[BE]   valueType: 'string'
[BE] }
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
[BE] === AUTH DEBUG ===
[BE] Auth Header: Present
[BE] Token extracted: Yes
[BE] Token preview: eyJhbGciOiJIUzI1NiIs...
[BE] JWT_SECRET exists: true
[BE] Token decoded successfully: {
[BE]   userId: '6696945dabbb289ecc6c2d15',
[BE]   iat: 1776956837,
[BE]   exp: 1777043237
[BE] }
[BE] User found: Yes
[BE] Auth successful for user: testuser@example.com
[BE] === AUTH DEBUG END ===
[BE] Error fetching order: CastError: Cast to ObjectId failed for value "0000bd-mk67e4v1" (type string) at path "_id" for model "Order"
[BE]     at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:250:11)
[BE]     at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]     at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]     at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]     at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]     at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]     at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]     at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80)
[BE]     at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
[BE]     at async getOrderById (/Users/harz/Documents/backUps/izmir/kaalis-store/backend/controllers/orderController.js:257:19) {
[BE]   stringValue: '"0000bd-mk67e4v1"',
[BE]   messageFormat: undefined,
[BE]   kind: 'ObjectId',
[BE]   value: '0000bd-mk67e4v1',
[BE]   path: '_id',
[BE]   reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
[BE]       at new ObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/bson/lib/bson.cjs:2517:23)
[BE]       at castObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast/objectid.js:25:12)
[BE]       at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:248:12)
[BE]       at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]       at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]       at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]       at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]       at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]       at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]       at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80),
[BE]   valueType: 'string'
[BE] }
[BE] 2026-04-23 19:52:22 warn: API Response:
[BE] 2026-04-23 19:52:22 info: API Request:
[BE] 2026-04-23 19:52:22 warn: API Response:
[BE] 2026-04-23 19:52:22 warn: API Response:
[BE] 2026-04-23 19:52:22 info: API Request:
[BE] 2026-04-23 19:52:22 warn: API Response:
[BE] User found: Yes
[BE] Auth successful for user: testuser@example.com
[BE] === AUTH DEBUG END ===
[BE] Error fetching order: CastError: Cast to ObjectId failed for value "0000bt-mob17shm" (type string) at path "_id" for model "Order"
[BE]     at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:250:11)
[BE]     at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]     at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]     at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]     at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]     at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]     at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]     at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80)
[BE]     at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
[BE]     at async getOrderById (/Users/harz/Documents/backUps/izmir/kaalis-store/backend/controllers/orderController.js:257:19) {
[BE]   stringValue: '"0000bt-mob17shm"',
[BE]   messageFormat: undefined,
[BE]   kind: 'ObjectId',
[BE]   value: '0000bt-mob17shm',
[BE]   path: '_id',
[BE]   reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
[BE]       at new ObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/bson/lib/bson.cjs:2517:23)
[BE]       at castObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast/objectid.js:25:12)
[BE]       at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:248:12)
[BE]       at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]       at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]       at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]       at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]       at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]       at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]       at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80),
[BE]   valueType: 'string'
[BE] }
[BE] User found: Yes
[BE] Auth successful for user: testuser@example.com
[BE] === AUTH DEBUG END ===
[BE] Error fetching order: CastError: Cast to ObjectId failed for value "0000bc-mk66i7v3" (type string) at path "_id" for model "Order"
[BE]     at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:250:11)
[BE]     at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]     at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]     at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]     at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]     at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]     at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]     at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80)
[BE]     at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
[BE]     at async getOrderById (/Users/harz/Documents/backUps/izmir/kaalis-store/backend/controllers/orderController.js:257:19) {
[BE]   stringValue: '"0000bc-mk66i7v3"',
[BE]   messageFormat: undefined,
[BE]   kind: 'ObjectId',
[BE]   value: '0000bc-mk66i7v3',
[BE]   path: '_id',
[BE]   reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
[BE]       at new ObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/bson/lib/bson.cjs:2517:23)
[BE]       at castObjectId (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast/objectid.js:25:12)
[BE]       at SchemaObjectId.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schema/objectId.js:248:12)
[BE]       at SchemaType.applySetters (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1236:12)
[BE]       at SchemaType.castForQuery (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/schemaType.js:1653:17)
[BE]       at cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/cast.js:390:32)
[BE]       at Query.cast (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4906:12)
[BE]       at Query._castConditions (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2309:10)
[BE]       at model.Query._findOne (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:2632:8)
[BE]       at model.Query.exec (/Users/harz/Documents/backUps/izmir/kaalis-store/node_modules/mongoose/lib/query.js:4458:80),
[BE]   valueType: 'string'
[BE] }
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
[BE] === AUTH DEBUG ===
[BE] Auth Header: Present
[BE] Token extracted: Yes
[BE] Token preview: eyJhbGciOiJIUzI1NiIs...
[BE] JWT_SECRET exists: true
[BE] Token decoded successfully: {
[BE]   userId: '6696945dabbb289ecc6c2d15',
[BE]   iat: 1776956837,
[BE]   exp: 1777043237
[BE] }
[BE] 2026-04-23 19:52:22 warn: API Response:
[BE] 2026-04-23 19:52:22 warn: API Response:
[BE] 2026-04-23 19:52:22 info: API Request:
[BE] User found: Yes
[BE] Auth successful for user: testuser@example.com
[BE] === AUTH DEBUG END ===
[BE] 2026-04-23 19:52:22 info: API Response:
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
[BE] === AUTH DEBUG ===
[BE] Auth Header: Present
[BE] Token extracted: Yes
[BE] Token preview: eyJhbGciOiJIUzI1NiIs...
[BE] JWT_SECRET exists: true
[BE] Token decoded successfully: {
[BE]   userId: '6696945dabbb289ecc6c2d15',
[BE]   iat: 1776956837,
[BE]   exp: 1777043237
[BE] }
[BE] 2026-04-23 19:52:22 info: API Request:
[BE] User found: Yes
[BE] Auth successful for user: testuser@example.com
[BE] === AUTH DEBUG END ===
[BE] 2026-04-23 19:52:22 info: API Response:
