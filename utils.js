"use strict";

/*==================================================
 Utility Functions
==================================================*/

/**
 * Priority labels used throughout the application.
 */
const priorities = Object.freeze([
    "low",
    "medium",
    "high"
]);

/**
 * Saves data to localStorage.
 * @param {Array} data
 */
function saveToStorage(data) {

    try {

        localStorage.setItem(
            "tasks",
            JSON.stringify(data)
        );

    } catch (error) {

        console.error(
            `Unable to save tasks: ${error.message}`
        );

    }

}

/**
 * Loads tasks from localStorage.
 * @returns {Array}
 */
function loadFromStorage() {

    try {

        const data = localStorage.getItem("tasks");

        return data
            ? JSON.parse(data)
            : [];

    } catch (error) {

        console.error(
            `Unable to load tasks: ${error.message}`
        );

        return [];

    }

}
/*==================================================
  Utility Functions
==================================================*/

/**
 * Generates a random integer ID.
 * @returns {number}
 */
function generateRandomId() {

    return Math.floor(Math.random() * 1000000);

}

/**
 * Formats a task name by trimming whitespace and
 * capitalizing the first letter.
 * @param {string} name
 * @returns {string}
 */
function formatTaskName(name) {

    if (typeof name !== "string") {
        throw new TypeError("Task name must be a string.");
    }

    const formattedName = name.trim();

    if (formattedName.length === 0) {
        return "";
    }

    return (
        formattedName.charAt(0).toUpperCase() +
        formattedName.slice(1).toLowerCase()
    );

}

/**
 * Determines whether a task is high priority.
 * @param {Object} task
 * @returns {boolean}
 */
function isHighPriority(task) {

    if (!task || typeof task !== "object") {
        return false;
    }

    return task.priority === 5 ||
           task.priority === "high";

}
/*==================================================
  Class Example
==================================================*/

/**
 * Base utility class.
 */
class Utility {

    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

}

/*==================================================
  Inheritance Example
==================================================*/

/**
 * Extended utility class.
 */
class AdvancedUtility extends Utility {

    constructor(name, version) {
        super(name);
        this.version = version;
    }

    getDetails() {
        return `${this.name} (v${this.version})`;
    }

}

/*==================================================
  Recursion Example
==================================================*/

/**
 * Recursively counts the number of items in an array.
 * @param {Array} array
 * @param {number} index
 * @returns {number}
 */
function recursiveCount(array, index = 0) {

    if (!Array.isArray(array)) {
        return 0;
    }

    if (index >= array.length) {
        return 0;
    }

    return 1 + recursiveCount(array, index + 1);

}

/*==================================================
  Functional Programming
==================================================*/

/**
 * Returns formatted task names.
 * Demonstrates map().
 * @param {Array} tasks
 * @returns {Array}
 */
function getFormattedTaskNames(tasks) {

    if (!Array.isArray(tasks)) {
        return [];
    }

    return tasks.map(task => formatTaskName(task.title));

}

/**
 * Returns completed tasks.
 * Demonstrates filter().
 * @param {Array} tasks
 * @returns {Array}
 */
function getCompletedTasks(tasks) {

    if (!Array.isArray(tasks)) {
        return [];
    }

    return tasks.filter(task => task.completed);

}

/**
 * Calculates total priority.
 * Demonstrates reduce().
 * @param {Array} tasks
 * @returns {number}
 */
function calculateTotalPriority(tasks) {

    if (!Array.isArray(tasks)) {
        return 0;
    }

    return tasks.reduce(
        (total, task) => total + task.priority,
        0
    );

}

/*==================================================
  Scope Demonstration
==================================================*/

/**
 * Demonstrates block scope using let and const.
 * @returns {string}
 */
function demonstrateScope() {

    const message = "Outer Scope";

    if (true) {

        const innerMessage = "Inner Scope";

        return `${message} -> ${innerMessage}`;

    }

}

/*==================================================
  Module Exports
==================================================*/

export {

    priorities,

    saveToStorage,

    loadFromStorage,

    generateRandomId,

    formatTaskName,

    isHighPriority,

    Utility,

    AdvancedUtility,

    recursiveCount,

    getFormattedTaskNames,

    getCompletedTasks,

    calculateTotalPriority,

    demonstrateScope

};