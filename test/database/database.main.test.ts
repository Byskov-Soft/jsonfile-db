// deno-lint-ignore-file no-explicit-any
import { assertEquals, assertThrows } from "@std/assert";
import { Database } from "../../src/database.ts";

// CONSTRUCTOR
Deno.test("Database - constructor initializes properties", () => {
    const db = new Database();
    const meta = db.getDBMeta();
    // Accessing private collections via type assertion for testing
    const collections = (db as any).collections;

    assertEquals(Array.isArray(collections), true);
    assertEquals(collections.length, 0);
    assertEquals(typeof meta.created === "string", true);
    assertEquals(typeof meta.updated === "string", true);
});

// CREATE COLLECTION
Deno.test("Database - createCollection creates a new collection", () => {
    const db = new Database();
    const collection = db.createCollection("testCollection");

    assertEquals(collection.getName(), "testCollection");
    // Accessing private collections array for testing
    const collections = (db as any).collections;
    assertEquals(collections.length, 1);
    assertEquals(collections[0], collection);
});

Deno.test("Database - createCollection throws error if collection exists", () => {
    const db = new Database();
    db.createCollection("testCollection");

    assertThrows(
        () => db.createCollection("testCollection"),
        Error,
        "Error 101",
    );
});

Deno.test("Database - createCollection updates database metadata", async () => {
    const db = new Database();
    const prevUpdated = db.getDBMeta().updated;

    await new Promise((resolve) => setTimeout(resolve, 100));

    db.createCollection("testCollection");
    const newUpdated = db.getDBMeta().updated;
    assertEquals(newUpdated > prevUpdated, true);
});

// COLLECTION
Deno.test("Database - collection method returns existing collection", () => {
    const db = new Database();

    // Create a collection using createCollection
    const createdCollection = db.createCollection("testCollection");

    // Retrieve the collection using the collection method
    const retrievedCollection = db.collection("testCollection");

    // Verify that the same collection is returned
    assertEquals(createdCollection, retrievedCollection);
});

Deno.test("Database - collection method creates new collection if it doesn't exist", () => {
    const db = new Database();

    // Ensure the collection does not exist yet
    const collectionsBefore = (db as any).collections.length;
    assertEquals(collectionsBefore, 0);

    // Retrieve (or create) the collection using the collection method
    const newCollection = db.collection("newCollection");

    // Verify that the collection has been created
    assertEquals(newCollection.getName(), "newCollection");

    // Verify that the collection has been added to the database
    const collectionsAfter = (db as any).collections.length;
    assertEquals(collectionsAfter, 1);
});

Deno.test("Database - collection method does not create duplicate collections", () => {
    const db = new Database();

    // Retrieve (or create) the collection using the collection method
    const collection1 = db.collection("testCollection");

    // Call the collection method again with the same name
    const collection2 = db.collection("testCollection");

    // Verify that the same collection is returned
    assertEquals(collection1, collection2);

    // Verify that only one collection exists in the database
    const collections = (db as any).collections;
    assertEquals(collections.length, 1);
});

// REMOVE COLLECTION
Deno.test("Database - removeCollection removes existing collection", () => {
    const db = new Database();

    // Create a collection
    db.createCollection("testCollection");

    // Ensure the collection exists
    assertEquals(db.hasCollection("testCollection"), true);

    // Remove the collection
    const result = db.removeCollection("testCollection");
    assertEquals(result, true);

    // Verify the collection no longer exists
    assertEquals(db.hasCollection("testCollection"), false);
});

Deno.test("Database - removeCollection throws error for non-existent collection", () => {
    const db = new Database();

    // Attempt to remove a non-existent collection
    assertThrows(
        () => db.removeCollection("nonExistentCollection"),
        Error,
        "Error 102",
    );
});

Deno.test("Database - removeCollection updates collection list", () => {
    const db = new Database();

    // Create multiple collections
    db.createCollection("collection1");
    db.createCollection("collection2");
    db.createCollection("collection3");

    // Remove one collection
    db.removeCollection("collection2");

    // Get remaining collection names
    const collections = db.getCollectionNames();
    assertEquals(collections.length, 2);
    assertEquals(collections.includes("collection1"), true);
    assertEquals(collections.includes("collection2"), false);
    assertEquals(collections.includes("collection3"), true);
});

Deno.test("Database - removeCollection updates metadata", async () => {
    const db = new Database();

    // Create a collection
    db.createCollection("testCollection");

    // Store previous update time
    const prevUpdated = db.getDBMeta().updated;

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Remove the collection
    db.removeCollection("testCollection");

    // Access updated time
    const newUpdated = db.getDBMeta().updated;

    // Verify that the updated time has changed
    assertEquals(newUpdated > prevUpdated, true);
});