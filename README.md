# jsonfile-db

JSON file database for Deno implemented in Typescript.

The code is based on [locallydb](https://github.com/btwael/locallydb). See original license: [LICENSE-locally-db](https://github.com/Byskov-Soft/jsonfile-db/blob/main/LICENSE-locally-db).

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

  Use it in your code: `import * as jsonfile_db from "jsonfile-db";`


- Import it directly in your code:

  `import * as jsonfile_db from "jsr:@bysk/jsonfile-db";`

- Read documentation from the [JSR registry](https://jsr.io/@bysk/jsonfile-db@0.1.1) if you need more help.

## Features and Limitations

- You can create as many databases as you want
- A database can be persisted/restored to/from a file
- A memory-first approach is followed, meaning that if you do not persist a database all changes will be lost on application exit.
- Rudimentary querying and deletion is available
  - By id
  - By one or more attributes

## Warning

Don't rely on this database solution for data you cannot afford to loose. Since persistence is based on writing and reading from files and no special error mitigation is implemented, app crashes and operating system issues could potentially result in a loss of data.

## API documentation

In progress...
