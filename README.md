# jsonfile-db

JSON file database for Deno implemented in Typescript.

The code is based on [locallydb](https://github.com/btwael/locallydb). See original license: [LICENSE-locally-db](https://github.com/Byskov-Soft/jsonfile-db/blob/main/misc/LICENSE-locally-db).

The purpose of the library is to provide a simple drop-in document (no-sql) database that can be used for low volume storage.

If you need advanced features such as user management, authentication, transactions, failure recovery, etc. this database is not the one to pick.

## Installation options

- Add it to your "imports" in `deno.json`:

  ```json
  {
    "imports": {
      "jsonfile-db": "jsr:@bysk/jsonfile-db"
    }
  }
  ```

  Use it in your code: `import { Database } from "jsonfile-db";`


- Import it directly in your code:

  `import { Database } from "jsr:@bysk/jsonfile-db";`

- Read documentation from the [JSR registry](https://jsr.io/@bysk/jsonfile-db@0.1.1) if you need more help.

## Features and Limitations

- You can create as many databases as you want
- A database can be persisted/restored to/from a file
- A memory-first approach is followed, meaning that if you do not persist a database all changes will be lost on application exit.
- Rudimentary querying and deletion is available
  - By id
  - By one or more attributes
- Databases, collections and documents are mutable, meaning that if a document is added to a collection, and the collection is added to a database all changes to these objects will be saved when the database is persisted.

## Warning

Don't rely on this database solution for data you cannot afford to loose. Since persistence is based on writing and reading from files and no special error mitigation is implemented, app crashes and operating system issues could potentially result in a loss of data.

# API Documentation

See the generated [JSDoc](./docs/index.html)

# Usage

## Create, restore and persist a database

```ts
import { Database } from '@bysk/jsonfile-db'

/*
  The location of the database
  Before persisting, create the directory with proper permissions
*/
const pathToDb = '/data/db.json'

const db = new Database()

/*
  Restore data from an existing database
  If you already have data in the database it will not be
  overwritten, so make sure to always use unique IDs
*/
await db.restore(pathToDb)

// .... operations

/*
  Persist the database
  If the database exists, it will be overwritten
*/
db.persist(pathToDb)
```

## Insert data

```ts
import { Database, Collection, Document } from '@bysk/jsonfile-db'

const db = new Database()
const contacts = db.collection('contacts')

/*
  Option 1 - Create a document and add it to the collection
  If you do not provide an ID ('_id' attribute), the Document constructor will generate a
  random UUID.
*/
const contact = new Document({ name: 'Mr. Bean', occupation: 'comedian', phone: '111222333' })
contacts.addDocument(contact)

/*
  Option 2 - Use the collection to create and add a document
  If you do not provide an ID ('_id' attribute), the collection will assign a running number
  starting from 0.
*/
contacts.createDocument({ name: 'Dr. Seuss', occupation: 'author', phone: '00000000000' })

/*
  Option 3 - Import an object to the collection
  Almost the same as 'createDocument' with the exception that the existance of an ID
  ('_id' attribute) is not checked by the collection, meaning that a Document constructor will
  generate a random UUID if it is missing.
*/
contacts.importDocument({ name: 'Socrates', occupation: 'philosopher', phone: '9898946464' })

/*
  Note that since the collections are references, they don't need to be re-inserted to the
  database when changed
*/

```

## Modifying data

```ts
import { Database, Collection } from '@bysk/jsonfile-db'

const db = new Database()
const contacts = new Collection('contacts', db)

const contact1 = contacts.createDocument({
  _id: 123, name: 'Dr. Seuss', occupation: 'author', phone: '000000000'
})

const contact2 = contacts.createDocument({
  _id: 456, name: 'Socrates', occupation: 'philosopher', phone: '9898946464'
})

contact1.setProperty('phone', '2222222222')
contacts.removeById(contact2._id)

/*
  If you don't want to modify attributes one-by-one, you have to replace the document
  in the collection
*/

if(contacts.removeById(contact1._id)) {
  const docData = contact1.obj()
  contacts.createDocument({ _id: docData._id, name: 'New Guy', occupation: 'Unemployed', phone: '9999999' })
}
```
