import { assertEquals, assertThrows } from "@std/assert";
import { Document } from "../document.ts";

Deno.test("Document - Constructor generates _id if not provided", () => {
    const doc = new Document({});
    assertEquals(typeof doc.getProperty("_id"), "string");
});

Deno.test("Document - Constructor uses provided _id", () => {
    const id = "test-id";
    const doc = new Document({ _id: id });
    assertEquals(doc.getProperty("_id"), id);
});

Deno.test("Document - Constructor with regular properties", () => {
    const doc = new Document({ name: "test", age: 25 });
    assertEquals(doc.getProperty("name"), "test");
    assertEquals(doc.getProperty("age"), 25);
});

Deno.test("Document - Constructor validates reserved keys", () => {
    assertThrows(
        () => new Document({ _rev: "1", name: "test" }),
        Error,
        "Error 201",
    );
});

Deno.test("Document - hasProperty", () => {
    const doc = new Document({ name: "test" });
    assertEquals(doc.hasProperty("name"), true);
    assertEquals(doc.hasProperty("nonexistent"), false);
});

Deno.test("Document - getProperty success", () => {
    const doc = new Document({ name: "test", age: 25 });
    assertEquals(doc.getProperty("name"), "test");
    assertEquals(doc.getProperty("age"), 25);
});

Deno.test("Document - getProperty throws on nonexistent key", () => {
    const doc = new Document({ name: "test" });
    assertThrows(
        () => doc.getProperty("nonexistent"),
        Error,
        "Error 204",
    );
});

Deno.test("Document - setProperty normal property", () => {
    const doc = new Document({});
    doc.setProperty("name", "test");
    assertEquals(doc.getProperty("name"), "test");
});

Deno.test("Document - setProperty throws on reserved key", () => {
    const doc = new Document({});
    assertThrows(
        () => doc.setProperty("_rev", "1"),
        Error,
        "Error 201",
    );
    assertThrows(
        () => doc.setProperty("_key", "test"),
        Error,
        "Error 201",
    );
});

Deno.test("Document - setProperty throws on immutable key", () => {
    const doc = new Document({});
    assertThrows(
        () => doc.setProperty("_id", "test-id"),
        Error,
        "Error 203",
    );
});

Deno.test("Document - setProperty updates _updated attribute", async () => {
    const doc = new Document({ name: "test" });
    const previousUpdated = doc.getProperty<string>("_updated");

    // Wait to ensure the timestamp will differ
    await new Promise((resolve) => setTimeout(resolve, 100));

    doc.setProperty("name", "updated test");
    const newUpdated = doc.getProperty<string>("_updated");

    // Assert that the _updated attribute has changed
    assertEquals(newUpdated > previousUpdated, true);
});
