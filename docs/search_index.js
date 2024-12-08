(function () {
  window.DENO_DOC_SEARCH_INDEX = {"nodes":[{"kind":[{"char":"I","kind":"Interface","title":"Interface"}],"name":"AttributeCriteria","file":".","doc":"Criteria used when querying a collection by attribute(s).\n\n### Example:\n\n  ```\n  collection.getByAttribute([\n    {\n      name: 'firstName',\n      value: 'John'\n    },\n    {\n      name: 'phone',\n      value: '+385',\n      opt: 'beginsWith'\n    }\n  ])\n  ```\n **Note:** Options `beginsWith`, `endsWith`, and `contains` only work with string values.\n","url":"././~/AttributeCriteria.html","deprecated":false},{"kind":[{"char":"p","kind":"Property","title":"Property"}],"name":"AttributeCriteria.name","file":".","doc":"The name of the attribute being queried.","url":"././~/AttributeCriteria.name.html","deprecated":false},{"kind":[{"char":"p","kind":"Property","title":"Property"}],"name":"AttributeCriteria.value","file":".","doc":"The value to match.","url":"././~/AttributeCriteria.value.html","deprecated":false},{"kind":[{"char":"p","kind":"Property","title":"Property"}],"name":"AttributeCriteria.opt","file":".","doc":"An optional query options applied to the value.","url":"././~/AttributeCriteria.opt.html","deprecated":false},{"kind":[{"char":"c","kind":"Class","title":"Class"}],"name":"Collection","file":".","doc":"The Collection class is used for managing documents.\n","url":"././~/Collection.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Collection.prototype.getName","file":".","doc":"Get the name of the collection.\n","url":"././~/Collection.prototype.getName.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Collection.prototype.setName","file":".","doc":"Set the name of the collection.\nBe aware that a database has a list of collections by name.\nIf you change the name after it has been associated with a database,\nthe database will not be able to find the collection by its new name.\n","url":"././~/Collection.prototype.setName.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Collection.prototype.createDocument","file":".","doc":"Create a new document from the provided object.\n\nIf the `_id`, `_created`, or `_updated` properties are not provided, they will be auto-generated.\n`_id` will be assigned from an auto-incremented integer.\n","url":"././~/Collection.prototype.createDocument.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Collection.prototype.importObject","file":".","doc":"Create a document by importing an object.\n\nIf the `_id`, `_created`, or `_updated` properties are not provided, they will be auto-generated.\n`_id` will be assigned a random UUID.\n","url":"././~/Collection.prototype.importObject.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Collection.prototype.addDocument","file":".","doc":"Add a document to the collection.\n","url":"././~/Collection.prototype.addDocument.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Collection.prototype.getById","file":".","doc":"Get a document by its `_id` attribute.\n","url":"././~/Collection.prototype.getById.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Collection.prototype.getByAttribute","file":".","doc":"Get all documents in the collection matching the provided criteria.\nUsing an empty array (`[]`) will return all documents.\nSee [AttributeCriteria](./AttributeCriteria.html) for more information.\n","url":"././~/Collection.prototype.getByAttribute.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Collection.prototype.removeById","file":".","doc":"Removes a document from the collection by its `_id` attribute.\nReturns `true` if the document was removed, `false` if not found.\n","url":"././~/Collection.prototype.removeById.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Collection.prototype.removeByAttribute","file":".","doc":"Removes all documents from the collection matching the provided criteria.\nNote that the optional criteria options (`beginsWith`, `endsWith`, and `contains`)\nare not supported. This means that only exact matches are removed.\nAlso, providing an empty array (`[]`) will not remove any documents.\n","url":"././~/Collection.prototype.removeByAttribute.html","deprecated":false},{"kind":[{"char":"c","kind":"Class","title":"Class"}],"name":"Database","file":".","doc":"The Database class is the main class of the library.\nIt is used to create and manage collections but also persisting\nand restoring the database.\n","url":"././~/Database.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Database.prototype.collection","file":".","doc":"Get a collection by its name. If the collection does not exist, it will be created.\n","url":"././~/Database.prototype.collection.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Database.prototype.createCollection","file":".","doc":"Creates a new collection in the database.\n","url":"././~/Database.prototype.createCollection.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Database.prototype.addCollection","file":".","doc":"Add a collection to the database.\n","url":"././~/Database.prototype.addCollection.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Database.prototype.getCollection","file":".","doc":"Get a collection existing in the database.\n","url":"././~/Database.prototype.getCollection.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Database.prototype.hasCollection","file":".","doc":"Check if a collection exists in the database.\n","url":"././~/Database.prototype.hasCollection.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Database.prototype.removeCollection","file":".","doc":"Removes a collection from the database.\n","url":"././~/Database.prototype.removeCollection.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Database.prototype.addOrReplaceCollection","file":".","doc":"Add or replace a collection in the database.\nIf a collection with the same name already exists, it will be replaced.\n","url":"././~/Database.prototype.addOrReplaceCollection.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Database.prototype.getCollectionNames","file":".","doc":"Get the names of all collections in the database.\n","url":"././~/Database.prototype.getCollectionNames.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Database.prototype.persist","file":".","doc":"Persist the database to a file.\n","url":"././~/Database.prototype.persist.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Database.prototype.restore","file":".","doc":"Restore a database from a file.\n","url":"././~/Database.prototype.restore.html","deprecated":false},{"kind":[{"char":"c","kind":"Class","title":"Class"}],"name":"Document","file":".","doc":"A Document is a wrapper around a data object that provides\na set of methods to interact with the object.\n","url":"././~/Document.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Document.prototype.hasProperty","file":".","doc":"Checks if the document object has a property with the given key.\n","url":"././~/Document.prototype.hasProperty.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Document.prototype.getProperty","file":".","doc":"Gets a property value of the document object with the given key.\n","url":"././~/Document.prototype.getProperty.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Document.prototype.object","file":".","doc":"Returns the document object.\n","url":"././~/Document.prototype.object.html","deprecated":false},{"kind":[{"char":"m","kind":"Method","title":"Method"}],"name":"Document.prototype.setProperty","file":".","doc":"Set the value of a property with the given key.\n","url":"././~/Document.prototype.setProperty.html","deprecated":false},{"kind":[{"char":"T","kind":"TypeAlias","title":"Type Alias"}],"name":"DocumentData","file":".","doc":"An object with metadata properties (`_id`, `_created`, and `_updated`)\nand any other key-value pairs","url":"././~/DocumentData.html","deprecated":false},{"kind":[{"char":"T","kind":"TypeAlias","title":"Type Alias"}],"name":"DocumentDataAny","file":".","doc":"Any object with any key-value pairs (key must be string)","url":"././~/DocumentDataAny.html","deprecated":false}]};
})()