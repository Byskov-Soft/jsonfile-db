import { assert, assertEquals } from "@std/assert";
import { Collection } from "../../src/collection.ts";
import { Database } from "../../src/database.ts";

// CONSTRUCTOR;
Deno.test("Collection - getName returns collection name", () => {
    const db = new Database();
    const collection = new Collection("test", db);
    assertEquals(collection.getName(), "test");
});

Deno.test("Collection - setName updates collection name", () => {
    const db = new Database();
    const collection = new Collection("test", db);
    collection.setName("newName");
    assertEquals(collection.getName(), "newName");
});

// CREATE DOCUMENT
Deno.test("Collection - createDocument with empty object", () => {
    const db = new Database();
    const collection = new Collection("test", db);
    const doc = collection.createDocument();

    assert(doc.hasProperty("_id"));
    assert(doc.hasProperty("_created"));
    assert(doc.hasProperty("_updated"));
    assertEquals(doc.getProperty("_id"), 0);
});

Deno.test("Collection - createDocument with custom object", () => {
    const db = new Database();
    const collection = new Collection("test", db);
    const doc = collection.createDocument({ name: "test", value: 123 });

    assert(doc.hasProperty("_id"));
    assert(doc.hasProperty("_created"));
    assert(doc.hasProperty("_updated"));
    assertEquals(doc.getProperty("name"), "test");
    assertEquals(doc.getProperty("value"), 123);
    assertEquals(doc.getProperty("_id"), 0);
});

Deno.test("Collection - createDocument increments _autoId", () => {
    const db = new Database();
    const collection = new Collection("test", db);

    const doc1 = collection.createDocument();
    const doc2 = collection.createDocument();

    assertEquals(doc1.getProperty("_id"), 0);
    assertEquals(doc2.getProperty("_id"), 1);
});
