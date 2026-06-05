/* @vitest-environment jsdom */

const fs = require("fs");
const path = require("path");
const request = require("supertest");

process.env.TASK_DB_FILE = path.join(__dirname, "task-tracker-ui-test.db");

const app = require("../../api/server");
const { createApp } = require("../../web/app");

function loadMarkup() {
  document.body.innerHTML = `
    <main class="container">
      <h1>Task Tracker Lite</h1>
      <p class="status" id="api-status">Checking API status...</p>
      <section class="panel">
        <h2>Create Task</h2>
        <form id="task-form" class="task-form">
          <label>Title<input id="title-input" name="title" type="text" maxlength="120" required /></label>
          <label>Description<textarea id="description-input" name="description" maxlength="500"></textarea></label>
          <label>Priority
            <select id="priority-input" name="priority" required>
              <option value="low">low</option>
              <option value="medium" selected>medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label>Due Date<input id="due-date-input" name="dueDate" type="date" /></label>
          <button id="create-task-btn" type="submit">Create Task</button>
        </form>
      </section>
      <section class="panel">
        <h2>Tasks</h2>
        <ul id="task-list" class="task-list"></ul>
      </section>
    </main>
  `;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitFor(predicate, timeoutMs = 1500) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) {
      return;
    }
    await delay(25);
  }
  throw new Error("Timed out waiting for condition");
}

describe("UI smoke test", () => {
  let server;
  let baseUrl;

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  beforeEach(() => {
    loadMarkup();
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }

    const testDb = process.env.TASK_DB_FILE;
    if (testDb && fs.existsSync(testDb)) {
      fs.unlinkSync(testDb);
    }
  });

  it("creates a task from the UI and shows it in the list", async () => {
    const appInstance = createApp({
      documentRef: document,
      fetchImpl: fetch,
      baseUrl,
    });

    await appInstance.initApp();

    document.getElementById("title-input").value = "UI smoke task";
    document.getElementById("description-input").value = "created by smoke test";
    document.getElementById("priority-input").value = "high";
    document.getElementById("task-form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await waitFor(() => {
      const firstTaskItem = document.querySelector("#task-list .task-item");
      return firstTaskItem && firstTaskItem.textContent.includes("UI smoke task");
    });

    const taskItems = [...document.querySelectorAll("#task-list .task-item")];
    expect(taskItems.length).toBeGreaterThan(0);
    expect(taskItems[0].textContent).toContain("UI smoke task");

    const tasksResponse = await request(app).get("/tasks");
    expect(tasksResponse.status).toBe(200);
    expect(tasksResponse.body.some((task) => task.title === "UI smoke task")).toBe(true);
  });

  it("opens inline detail, keeps one open at a time, and supports quick actions", async () => {
    const appInstance = createApp({
      documentRef: document,
      fetchImpl: fetch,
      baseUrl,
    });

    await appInstance.initApp();

    document.getElementById("title-input").value = "Detail Task One";
    document.getElementById("description-input").value = "first detail test task";
    document.getElementById("priority-input").value = "low";
    document.getElementById("task-form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await waitFor(() => document.querySelectorAll("#task-list .task-item").length >= 1);

    document.getElementById("title-input").value = "Detail Task Two";
    document.getElementById("description-input").value = "second detail test task";
    document.getElementById("priority-input").value = "high";
    document.getElementById("task-form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await waitFor(() => {
      const items = [...document.querySelectorAll("#task-list .task-item")];
      return items.some((item) => item.textContent.includes("Detail Task One")) && items.some((item) => item.textContent.includes("Detail Task Two"));
    });

    let firstTaskItem = [...document.querySelectorAll("#task-list .task-item")].find((item) => item.textContent.includes("Detail Task One"));
    expect(firstTaskItem).toBeTruthy();

    firstTaskItem.querySelector("button[data-action='toggle-open']").click();

    await waitFor(() => {
      const refreshedFirst = [...document.querySelectorAll("#task-list .task-item")].find((item) => item.textContent.includes("Detail Task One"));
      const detail = refreshedFirst && refreshedFirst.querySelector(".task-detail");
      return detail && detail.textContent.includes("Description:") && detail.textContent.includes("Created At:");
    });

    const secondTaskItem = [...document.querySelectorAll("#task-list .task-item")].find((item) => item.textContent.includes("Detail Task Two"));
    expect(secondTaskItem).toBeTruthy();

    secondTaskItem.querySelector("button[data-action='toggle-open']").click();

    await waitFor(() => {
      const refreshedItems = [...document.querySelectorAll("#task-list .task-item")];
      const refreshedFirst = refreshedItems.find((item) => item.textContent.includes("Detail Task One"));
      const refreshedSecond = refreshedItems.find((item) => item.textContent.includes("Detail Task Two"));
      return refreshedSecond.querySelector(".task-detail") && !refreshedFirst.querySelector(".task-detail");
    });

    let refreshedSecond = [...document.querySelectorAll("#task-list .task-item")].find((item) => item.textContent.includes("Detail Task Two"));
    refreshedSecond.querySelector("button[data-action='start-edit']").click();

    await waitFor(() => {
      const editingTask = [...document.querySelectorAll("#task-list .task-item")].find((item) => item.textContent.includes("Detail Task Two"));
      return editingTask && editingTask.querySelector(".task-edit-form");
    });

    refreshedSecond = [...document.querySelectorAll("#task-list .task-item")].find((item) => item.textContent.includes("Detail Task Two"));
    const editForm = refreshedSecond.querySelector(".task-edit-form");
    editForm.querySelector("input[name='title']").value = "Detail Task Two Edited";
    editForm.querySelector("textarea[name='description']").value = "updated detail test task";
    editForm.querySelector("select[name='priority']").value = "medium";
    editForm.querySelector("input[name='dueDate']").value = "2026-08-10";
    refreshedSecond.querySelector("button[data-action='save-edit']").click();

    await waitFor(() => {
      const updatedTask = [...document.querySelectorAll("#task-list .task-item")].find((item) => item.textContent.includes("Detail Task Two Edited"));
      return updatedTask && updatedTask.textContent.includes("medium | open");
    });

    await waitFor(() => {
      const updatedTask = [...document.querySelectorAll("#task-list .task-item")].find((item) => item.textContent.includes("Detail Task Two Edited"));
      const detail = updatedTask && updatedTask.querySelector(".task-detail");
      return detail && detail.textContent.includes("Due Date:") && detail.textContent.includes("2026-08-10");
    });

    refreshedSecond = [...document.querySelectorAll("#task-list .task-item")].find((item) => item.textContent.includes("Detail Task Two Edited"));
    refreshedSecond.querySelector("button[data-action='mark-done']").click();

    await waitFor(() => {
      const updatedTask = [...document.querySelectorAll("#task-list .task-item")].find((item) => item.textContent.includes("Detail Task Two Edited"));
      return updatedTask && updatedTask.textContent.includes("done");
    });

    await waitFor(() => {
      const updatedTask = [...document.querySelectorAll("#task-list .task-item")].find((item) => item.textContent.includes("Detail Task Two Edited"));
      return updatedTask && updatedTask.querySelector("button[data-action='delete']");
    });

    refreshedSecond = [...document.querySelectorAll("#task-list .task-item")].find((item) => item.textContent.includes("Detail Task Two Edited"));
    refreshedSecond.querySelector("button[data-action='delete']").click();

    await waitFor(() => {
      const items = [...document.querySelectorAll("#task-list .task-item")];
      return !items.some((item) => item.textContent.includes("Detail Task Two Edited"));
    });
  });
});
