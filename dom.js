"use strict";

import {
    taskManager
} from "./app.js";

import {
    saveToStorage,
    loadFromStorage
} from "./utils.js";

/*==================================================
 DOM Manipulation
==================================================*/

/**
 * Sets up every event listener the app needs: form submission,
 * auto-save on unload, an Escape-to-clear shortcut on the title
 * field, and delegated click/change handling on the task list
 * (toggle complete, delete, inline priority updates).
 */
function setupEventListeners() {

    const form = document.getElementById("task-form");

    if (form) {
        form.addEventListener("submit", handleAddTask);
    }

    // Auto-save the current task list before the page unloads
    window.addEventListener("beforeunload", () => {
        saveToStorage(taskManager.tasks);
    });

    // Let the user press Escape to quickly clear the add-task form
    const titleInput = document.getElementById("title");

    titleInput?.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            clearTaskForm();
        }

    });

    const container = document.getElementById("task-list");

    // Delegate both click (complete/delete buttons) and change
    // (inline priority select) to the shared task-list container,
    // rather than attaching a listener per task.
    container?.addEventListener("click", handleTaskClick);
    container?.addEventListener("change", handlePriorityChange);

}

/**
 * Clears the add-task form inputs back to their defaults.
 */
function clearTaskForm() {

    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const priorityInput = document.getElementById("priority");

    if (!titleInput || !descriptionInput || !priorityInput) {
        return;
    }

    titleInput.value = "";
    descriptionInput.value = "";
    priorityInput.value = "1";

}

/*==================================================
  Application Initialization
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        setupEventListeners();

        loadTasks();

        displayTasks();

        updateStatistics();

    }

);
/**
 * Handles adding a new task.
 * @param {Event} [event]
 */
function handleAddTask(event) {

    // Prevent page refresh if called from a form
    event?.preventDefault();

    // Select inputs
    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const priorityInput = document.getElementById("priority");

    // Ensure required elements exist
    if (!titleInput || !descriptionInput || !priorityInput) {

        console.error("One or more input elements are missing.");

        return;

    }

    // Read values
    const title = titleInput.value?.trim() ?? "";
    const description = descriptionInput.value?.trim() ?? "";
    const priority = Number(priorityInput.value ?? NaN);

    // Validation
    if (title === "") {

        alert("Please enter a task title.");

        titleInput.focus();

        return;

    }

    if (Number.isNaN(priority) || priority < 1 || priority > 5) {

        alert("Priority must be between 1 and 5.");

        priorityInput.focus();

        return;

    }

    // Add task
    const newTask = taskManager.add(
        title,
        description,
        priority
    );

    if (!newTask) {

        alert("Unable to create task.");

        return;

    }

    // Save to storage
    saveToStorage(taskManager.tasks);

    // Refresh UI
    displayTasks();
    updateStatistics();

    // Clear form
    clearTaskForm();

    // Return focus for easier task entry
    titleInput.focus();

}
/**
 * Builds the markup for a single task's priority <select>,
 * with the task's current priority pre-selected.
 * @param {{ id: number, priority: number }} task
 * @returns {string}
 */
function buildPrioritySelect(task) {

    const options = [1, 2, 3, 4, 5].map(value => `
                        <option value="${value}" ${value === task.priority ? "selected" : ""}>
                            ${value}
                        </option>
    `).join("");

    return `
                    <select class="priority-select" data-id="${task.id}" aria-label="Change priority for ${task.title}">
                        ${options}
                    </select>
    `;

}

/**
 * Displays all tasks in the DOM.
 */
function displayTasks() {

    const container = document.getElementById("task-list");

    if (!container) {

        console.error("Task container not found.");

        return;

    }

    const tasks = taskManager.tasks;

    // Clear existing tasks
    container.innerHTML = "";

    // Display message if there are no tasks
    if (tasks.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <p>No tasks available.</p>
            </div>
        `;

        return;

    }

    // Build task cards
    tasks.forEach(task => {

        container.insertAdjacentHTML(

            "beforeend",

            `
            <div class="task ${task.completed ? "completed" : ""}" data-id="${task.id}">

                <h3>${task.title}</h3>

                <p>${task.description}</p>

                <p><strong>ID:</strong> ${task.id}</p>

                <p>
                    <strong>Priority:</strong> ${task.priority}
                    ${buildPrioritySelect(task)}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${task.completed ? "Completed ✅" : "Pending ⏳"}
                </p>

                <div class="task-actions">

                    <button
                        class="complete-btn"
                        data-id="${task.id}">
                        Toggle Complete
                    </button>

                    <button
                        class="delete-btn"
                        data-id="${task.id}">
                        Delete
                    </button>

                </div>

            </div>
            `

        );

    });

}
/**
 * Updates the task statistics section in the DOM.
 * Uses TaskManager's getSummary() to compute values in one place.
 */
function updateStatistics() {

    const totalEl = document.getElementById("total-tasks");
    const completedEl = document.getElementById("completed-tasks");
    const pendingEl = document.getElementById("pending-tasks");

    // Null checks before touching the DOM
    if (!totalEl || !completedEl || !pendingEl) {
        console.error("Statistics elements not found.");
        return;
    }

    const { total, completed, pending } = taskManager.getSummary();

    totalEl.textContent = total;
    completedEl.textContent = completed;
    pendingEl.textContent = pending;

}

/**
 * Handles task button clicks using event delegation.
 * Uses closest() + optional chaining so a click on a nested
 * element (an icon inside a button, say) still resolves to the
 * right data-id instead of silently doing nothing.
 * @param {Event} event
 */
function handleTaskClick(event) {

    const target = event.target?.closest("[data-id]");

    if (!target) {
        return;
    }

    const taskId = Number(target.dataset?.id ?? NaN);

    if (Number.isNaN(taskId)) {
        return;
    }

    // Toggle completion
    if (target.classList.contains("complete-btn")) {

        const toggled = taskManager.toggleCompletion(taskId);

        if (!toggled) {
            console.error("Task not found.");
            return;
        }

        saveToStorage(taskManager.tasks);

        displayTasks();
        updateStatistics();

        return;

    }

    // Delete task
    if (target.classList.contains("delete-btn")) {

        const removed = taskManager.remove(taskId);

        if (removed) {

            saveToStorage(taskManager.tasks);

            displayTasks();
            updateStatistics();

        } else {

            console.error("Task not found.");

        }

    }

}

/**
 * Handles inline priority changes from a task card's priority
 * <select>, delegated from the task list container.
 * @param {Event} event
 */
function handlePriorityChange(event) {

    const target = event.target?.closest(".priority-select");

    if (!target) {
        return;
    }

    const taskId = Number(target.dataset?.id ?? NaN);
    const newPriority = Number(target.value ?? NaN);

    if (Number.isNaN(taskId) || Number.isNaN(newPriority)) {
        return;
    }

    const updated = taskManager.updatePriority(taskId, newPriority);

    if (!updated) {
        console.error("Task not found.");
        return;
    }

    saveToStorage(taskManager.tasks);

    displayTasks();
    updateStatistics();

}
/*==================================================
  Local Storage Functions
==================================================*/

/**
 * Saves the current task list.
 */
function saveTasks() {

    saveToStorage(taskManager.tasks);

}

/**
 * Loads tasks from localStorage into the shared task manager.
 */
function loadTasks() {

    taskManager.restore(loadFromStorage());

}

/*==================================================
  Module Exports
  (harmless in the browser; lets tests import and drive
  these functions directly)
==================================================*/

export {

    setupEventListeners,

    clearTaskForm,

    handleAddTask,

    displayTasks,

    updateStatistics,

    handleTaskClick,

    handlePriorityChange,

    saveTasks,

    loadTasks

};
