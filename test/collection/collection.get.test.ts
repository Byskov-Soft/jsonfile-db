import { assert, assertEquals, assertThrows } from "@std/assert";
import { Collection } from "../../src/collection.ts";
import { Database } from "../../src/database.ts";

// GET BY ID
Deno.test("Collection - getById returns document when found", () => {
    const db = new Database();
    const collection = new Collection("test", db);
    collection.createDocument({ name: "test" });
    const foundDoc = collection.getById(0);

    assert(foundDoc !== null);
    assertEquals(foundDoc?.getProperty("name"), "test");
    assertEquals(foundDoc?.getProperty("_id"), 0);
});

Deno.test("Collection - getById throws error when not found", () => {
    const db = new Database();
    const collection = new Collection("test", db);
    collection.createDocument({ name: "test" });

    assertThrows(
        () => collection.getById(999),
        Error,
        "Error 301",
    );
});

Deno.test("Collection - getById finds correct document among many", () => {
    const db = new Database();
    const collection = new Collection("test", db);

    collection.createDocument({ name: "first" });
    collection.createDocument({ name: "second" });
    collection.createDocument({ name: "third" });

    const foundDoc = collection.getById(1);

    assert(foundDoc !== null);
    assertEquals(foundDoc?.getProperty("name"), "second");
    assertEquals(foundDoc?.getProperty("_id"), 1);
});

// GET BY ATTRIBUTE
Deno.test("Collection - getByAttribute with single attribute", () => {
    const db = new Database();
    const collection = new Collection("test", db);

    collection.createDocument({ name: "test1", type: "a" });
    collection.createDocument({ name: "test2", type: "b" });
    collection.createDocument({ name: "test3", type: "a" });

    const docs = collection.getByAttribute([
        { name: "type", value: "a" },
    ]);

    assertEquals(docs.length, 2);
    assertEquals(docs[0].getProperty("name"), "test1");
    assertEquals(docs[1].getProperty("name"), "test3");
});

Deno.test("Collection - getByAttribute with multiple attributes", () => {
    const db = new Database();
    const collection = new Collection("test", db);

    collection.createDocument({ name: "test1", type: "a", status: "active" });
    collection.createDocument({ name: "test2", type: "a", status: "inactive" });
    collection.createDocument({ name: "test3", type: "a", status: "active" });

    const docs = collection.getByAttribute([
        { name: "type", value: "a" },
        { name: "status", value: "active" },
    ]);

    assertEquals(docs.length, 2);
    assertEquals(docs[0].getProperty("name"), "test1");
    assertEquals(docs[1].getProperty("name"), "test3");
});

Deno.test("Collection - getByAttribute returns empty array when no matches", () => {
    const db = new Database();
    const collection = new Collection("test", db);

    collection.createDocument({ name: "test1", type: "a" });
    collection.createDocument({ name: "test2", type: "b" });

    const docs = collection.getByAttribute([
        { name: "type", value: "c" },
    ]);

    assertEquals(docs.length, 0);
});
