import { assertEquals, assertThrows } from "@std/assert";
import { AttributeCriteria, Collection } from "../../src/collection.ts";
import { Database } from "../../src/database.ts";

// REMOVE BY ID
Deno.test("Collection - removeById removes existing document", () => {
    const db = new Database();
    const collection = new Collection("test", db);

    // Create a document
    const doc = collection.createDocument({ name: "test doc" });
    const id = doc.getProperty<string | number>("_id");

    // Ensure the document exists
    const existingDoc = collection.getById(id);
    assertEquals(existingDoc !== null, true);

    // Remove the document
    const result = collection.removeById(id);
    assertEquals(result, true);

    // Verify the document has been removed
    assertThrows(
        () => collection.getById(id),
        Error,
        "Error 301",
    );
});

Deno.test("Collection - removeById returns false for non-existent ID", () => {
    const db = new Database();
    const collection = new Collection("test", db);

    // Attempt to remove a non-existent document
    const result = collection.removeById(999);
    assertEquals(result, false);
});

Deno.test("Collection - removeById updates collection metadata", async () => {
    const db = new Database();
    const collection = new Collection("test", db);

    // Create a document
    const doc = collection.createDocument({ name: "test doc" });
    const id = doc.getProperty<string | number>("_id");

    // Store the previous update time
    const previousUpdateTime = collection.getCollectionMeta().updated;

    // Wait for 100ms to make sure time has progressed
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Remove the document
    collection.removeById(id);

    // Verify that the update time has changed
    const newUpdateTime = collection.getCollectionMeta().updated;
    assertEquals(newUpdateTime > previousUpdateTime, true);
});

// REMOVE BY ATTRIBUTE
Deno.test("Collection - removeByAttribute removes documents matching single attribute", () => {
    const db = new Database();
    const collection = new Collection("test", db);

    // Create documents
    collection.createDocument({ name: "Doc1", type: "A" });
    collection.createDocument({ name: "Doc2", type: "B" });
    collection.createDocument({ name: "Doc3", type: "A" });

    // Remove documents with type "A"
    const criteria = [{ name: "type", value: "A" }];
    const result = collection.removeByAttribute(criteria);
    assertEquals(result, true);

    // Verify that only documents with type "B" remain
    const remainingDocs = collection.getByAttribute([]);
    assertEquals(remainingDocs.length, 1);
    assertEquals(remainingDocs[0].getProperty("name"), "Doc2");
});

Deno.test("Collection - removeByAttribute removes documents matching multiple attributes", () => {
    const db = new Database();
    const collection = new Collection("test", db);

    // Create documents
    collection.createDocument({ name: "Doc1", type: "A", status: "active" });
    collection.createDocument({ name: "Doc2", type: "A", status: "inactive" });
    collection.createDocument({ name: "Doc3", type: "B", status: "active" });
    collection.createDocument({ name: "Doc4", type: "A", status: "active" });

    // Remove documents with type "A" and status "active"
    const criteria = [
        { name: "type", value: "A" },
        { name: "status", value: "active" },
    ];
    const result = collection.removeByAttribute(criteria);
    assertEquals(result, true);

    // Verify that only documents not matching the criteria remain
    const remainingDocs = collection.getByAttribute([]);
    assertEquals(remainingDocs.length, 2);
    const remainingNames = remainingDocs.map((doc) => doc.getProperty("name"));
    assertEquals(remainingNames.includes("Doc2"), true);
    assertEquals(remainingNames.includes("Doc3"), true);
});

Deno.test("Collection - removeByAttribute returns false when no documents match", () => {
    const db = new Database();
    const collection = new Collection("test", db);

    // Create documents
    collection.createDocument({ name: "Doc1", type: "A" });
    collection.createDocument({ name: "Doc2", type: "B" });

    // Attempt to remove documents with type "C"
    const criteria = [{ name: "type", value: "C" }];
    const result = collection.removeByAttribute(criteria);
    assertEquals(result, false);

    // Verify that all documents still exist
    const remainingDocs = collection.getByAttribute([]);
    assertEquals(remainingDocs.length, 2);
});

Deno.test("Collection - removeByAttribute with empty criteria removes no documents", () => {
    const db = new Database();
    const collection = new Collection("test", db);

    // Create documents
    collection.createDocument({ name: "Doc1", type: "A" });
    collection.createDocument({ name: "Doc2", type: "B" });

    // Attempt to remove documents with empty criteria
    const criteria: AttributeCriteria[] = [];
    const result = collection.removeByAttribute(criteria);
    assertEquals(result, false);

    // Verify that all documents still exist
    const remainingDocs = collection.getByAttribute([]);
    assertEquals(remainingDocs.length, 2);
});

Deno.test("Collection - removeByAttribute updates collection metadata", async () => {
    const db = new Database();
    const collection = new Collection("test", db);

    // Create documents
    collection.createDocument({ name: "Doc1", type: "A" });
    collection.createDocument({ name: "Doc2", type: "A" });

    // Store the previous update time
    const previousUpdateTime = collection.getCollectionMeta().updated;

    // Wait for 100ms to make sure time has progressed
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Remove documents with type "A"
    const criteria = [{ name: "type", value: "A" }];
    collection.removeByAttribute(criteria);

    // Verify that the update time has changed
    const newUpdateTime = collection.getCollectionMeta().updated;
    assertEquals(newUpdateTime > previousUpdateTime, true);
});
