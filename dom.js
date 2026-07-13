"use strict";

import {
    taskList,
    addTask,
    Task
} from "./app.js";

import {
    saveToStorage,
    loadFromStorage
} from "./utils.js";

/*==================================================
 DOM Manipulation
==================================================*/

/**
 * Sets up all event listeners.
 */
function setupEventListeners() {

    const form = document.getElementById("task-form");

    if (form) {
        form.addEventListener("submit", handleAddTask);
    }

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

        const container = document.getElementById("task-list");

        if (container) {

            container.addEventListener(

                "click",

                handleTaskClick

            );

        }

    }

);
/**
 * Handles adding a new task.
 * @param {Event} event
 */
function handleAddTask(event) {

    // Prevent page refresh if called from a form
    if (event) {
        event.preventDefault();
    }

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
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const priority = Number(priorityInput.value);

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
    const newTask = addTask(
        title,
        description,
        priority
    );

    if (!newTask) {

        alert("Unable to create task.");

        return;

    }

    // Save to storage
    saveToStorage(taskList);

    // Refresh UI
    displayTasks();

    // Clear form
    titleInput.value = "";
    descriptionInput.value = "";
    priorityInput.value = "1";

    // Return focus for easier task entry
    titleInput.focus();

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

    // Clear existing tasks
    container.innerHTML = "";

    // Display message if there are no tasks
    if (taskList.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <p>No tasks available.</p>
            </div>
        `;

        return;

    }

    // Build task cards
    taskList.forEach(task => {

        container.insertAdjacentHTML(

            "beforeend",

            `
            <div class="task ${task.completed ? "completed" : ""}" data-id="${task.id}">

                <h3>${task.title}</h3>

                <p>${task.description}</p>

                <p><strong>ID:</strong> ${task.id}</p>

                <p><strong>Priority:</strong> ${task.priority}</p>

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
 * Handles task button clicks using event delegation.
 * @param {Event} event
 */
function handleTaskClick(event) {

    const target = event.target;

    if (!target) {
        return;
    }

    const taskId = Number(target.dataset.id);

    if (Number.isNaN(taskId)) {
        return;
    }

    // Find the task
    const task = taskList.find(task => task.id === taskId);

    if (!task) {
        console.error("Task not found.");
        return;
    }

    // Toggle completion
    if (target.classList.contains("complete-btn")) {

        task.toggleCompletion();

        saveToStorage(taskList);

        displayTasks();

        return;

    }

    // Delete task
    if (target.classList.contains("delete-btn")) {

        const index = taskList.findIndex(
            task => task.id === taskId
        );

        if (index !== -1) {

            taskList.splice(index, 1);

            saveToStorage(taskList);

            displayTasks();

        }

    }

}
/*==================================================
  Local Storage Functions
==================================================*/

/**
 * Saves the current task list.
 */
function saveTasks() {

    saveToStorage(taskList);

}

/**
 * Loads tasks from localStorage.
 */
function loadTasks() {

    const storedTasks = loadFromStorage();

    if (!Array.isArray(storedTasks)) {
        return;
    }

    taskList.length = 0;

    storedTasks.forEach(task => {

        const restoredTask = new Task(

            task.title,

            task.description,

            task.priority

        );

        restoredTask.id = task.id;
        restoredTask.completed = task.completed;

        taskList.push(restoredTask);

    });

}
