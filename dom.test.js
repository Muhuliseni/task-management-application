/**
 * @jest-environment jsdom
 */

import {
    setupEventListeners,
    clearTaskForm,
    handleAddTask,
    displayTasks,
    updateStatistics,
    handleTaskClick,
    handlePriorityChange,
    loadTasks
} from "./dom.js";

import { taskManager, resetTaskManager } from "./app.js";

/**
 * A minimal in-memory localStorage mock. jsdom's built-in
 * implementation varies by version, so tests supply their own to
 * keep results independent of that and reset between tests.
 * @returns {Storage}
 */
function createLocalStorageMock() {

    let store = {};

    return {
        getItem: key => (key in store ? store[key] : null),
        setItem: (key, value) => {
            store[key] = String(value);
        },
        removeItem: key => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };

}

/**
 * Rebuilds the subset of index.html's markup that dom.js depends on.
 */
function renderAppShell() {

    document.body.innerHTML = `
        <form id="task-form">
            <input id="title" />
            <textarea id="description"></textarea>
            <select id="priority">
                <option value="1">Low</option>
                <option value="3">Medium</option>
                <option value="5">High</option>
            </select>
            <button type="submit">Add Task</button>
        </form>
        <div id="stats-container">
            <span id="total-tasks">0</span>
            <span id="completed-tasks">0</span>
            <span id="pending-tasks">0</span>
        </div>
        <div id="task-list"></div>
    `;

}

beforeEach(() => {

    renderAppShell();

    Object.defineProperty(window, "localStorage", {
        value: createLocalStorageMock(),
        writable: true,
        configurable: true
    });

    window.alert = jest.fn();

    resetTaskManager();

});

describe("displayTasks", () => {

    test("renders an empty state when there are no tasks", () => {

        displayTasks();

        const container = document.getElementById("task-list");

        expect(container.textContent).toContain("No tasks available.");

    });

    test("renders a card for each task", () => {

        taskManager.add("Task One", "Description", 3);
        taskManager.add("Task Two", "Description", 5);

        displayTasks();

        const container = document.getElementById("task-list");

        expect(container.querySelectorAll(".task")).toHaveLength(2);
        expect(container.textContent).toContain("Task One");
        expect(container.textContent).toContain("Task Two");

    });

});

describe("updateStatistics", () => {

    test("reflects total, completed, and pending counts", () => {

        const task1 = taskManager.add("Task 1", "Description", 2);
        taskManager.add("Task 2", "Description", 4);

        taskManager.toggleCompletion(task1.id);

        updateStatistics();

        expect(document.getElementById("total-tasks").textContent).toBe("2");
        expect(document.getElementById("completed-tasks").textContent).toBe("1");
        expect(document.getElementById("pending-tasks").textContent).toBe("1");

    });

});

describe("handleTaskClick (delegated click handling)", () => {

    test("toggles completion when the complete button is clicked", () => {

        const task = taskManager.add("Task", "Description", 3);

        displayTasks();

        const completeBtn = document.querySelector(".complete-btn");

        handleTaskClick({ target: completeBtn });

        expect(taskManager.findById(task.id).completed).toBe(true);

    });

    test("removes the task when the delete button is clicked", () => {

        taskManager.add("Task", "Description", 3);

        displayTasks();

        const deleteBtn = document.querySelector(".delete-btn");

        handleTaskClick({ target: deleteBtn });

        expect(taskManager.totalTasks).toBe(0);

    });

    test("does nothing when the click target has no data-id", () => {

        taskManager.add("Task", "Description", 3);

        displayTasks();

        const heading = document.querySelector("h3");

        expect(() => handleTaskClick({ target: heading })).not.toThrow();
        expect(taskManager.totalTasks).toBe(1);

    });

});

describe("handlePriorityChange (delegated change handling)", () => {

    test("updates a task's priority via the inline select", () => {

        const task = taskManager.add("Task", "Description", 2);

        displayTasks();

        const select = document.querySelector(".priority-select");

        select.value = "5";

        handlePriorityChange({ target: select });

        expect(taskManager.findById(task.id).priority).toBe(5);

    });

    test("does nothing when the change target is not a priority select", () => {

        taskManager.add("Task", "Description", 2);

        displayTasks();

        const heading = document.querySelector("h3");

        expect(() => handlePriorityChange({ target: heading })).not.toThrow();

    });

});

describe("event delegation integration", () => {

    test("a real click on the container reaches handleTaskClick via delegation", () => {

        const task = taskManager.add("Task", "Description", 3);

        displayTasks();

        setupEventListeners();

        const completeBtn = document.querySelector(".complete-btn");

        completeBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(taskManager.findById(task.id).completed).toBe(true);

    });

});

describe("handleAddTask", () => {

    test("adds a task built from the form's current values", () => {

        document.getElementById("title").value = "New Task";
        document.getElementById("description").value = "From the form";
        document.getElementById("priority").value = "5";

        handleAddTask();

        expect(taskManager.totalTasks).toBe(1);
        expect(taskManager.tasks[0].title).toBe("New Task");
        expect(taskManager.tasks[0].priority).toBe(5);

    });

    test("clears the form after successfully adding a task", () => {

        document.getElementById("title").value = "New Task";

        handleAddTask();

        expect(document.getElementById("title").value).toBe("");

    });

    test("alerts and adds nothing when the title is blank", () => {

        document.getElementById("title").value = "   ";

        handleAddTask();

        expect(window.alert).toHaveBeenCalled();
        expect(taskManager.totalTasks).toBe(0);

    });

});

describe("clearTaskForm", () => {

    test("resets the form fields to their defaults", () => {

        document.getElementById("title").value = "Something";
        document.getElementById("description").value = "Something else";
        document.getElementById("priority").value = "5";

        clearTaskForm();

        expect(document.getElementById("title").value).toBe("");
        expect(document.getElementById("description").value).toBe("");
        expect(document.getElementById("priority").value).toBe("1");

    });

});

describe("loadTasks", () => {

    test("restores tasks from localStorage into the shared manager", () => {

        window.localStorage.setItem(
            "tasks",
            JSON.stringify([
                { id: 7, title: "Saved Task", description: "From storage", priority: 4, completed: true }
            ])
        );

        loadTasks();

        expect(taskManager.totalTasks).toBe(1);
        expect(taskManager.tasks[0].title).toBe("Saved Task");
        expect(taskManager.tasks[0].completed).toBe(true);

    });

});
