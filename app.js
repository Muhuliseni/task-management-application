"use strict";

/*
====================================================
Task Management Application
Core Application Logic
====================================================
*/

import { PRIORITY_MIN, PRIORITY_MAX, ERROR_MESSAGES } from "./constants.js";

/*==================================================
  Task Class
==================================================*/

/**
 * Represents a single task.
 */
class Task {

    /**
     * Auto-incrementing id counter, private to the class itself
     * (rather than a mutable global variable) so nothing outside
     * Task can tamper with id generation.
     */
    static #idCounter = 0;

    /**
     * Create a new task.
     * @param {string} title
     * @param {string} description
     * @param {number} priority
     * @throws {Error} If title, description, or priority are invalid.
     */
    constructor(title, description, priority) {

        // Defensive programming

        if (typeof title !== "string" || title.trim() === "") {
            throw new Error(ERROR_MESSAGES.EMPTY_TITLE);
        }

        if (typeof description !== "string") {
            throw new Error(ERROR_MESSAGES.INVALID_DESCRIPTION);
        }

        if (
            typeof priority !== "number" ||
            Number.isNaN(priority) ||
            priority < PRIORITY_MIN ||
            priority > PRIORITY_MAX
        ) {
            throw new Error(ERROR_MESSAGES.INVALID_PRIORITY);
        }

        // Unique ID

        this.id = Task.#nextId();

        // Store values

        this.title = title.trim();
        this.description = description.trim();
        this.priority = priority;
        this.completed = false;
    }

    /**
     * Toggle completion status.
     */
    toggleCompletion() {

        this.completed = !this.completed;

    }

    /**
     * Returns formatted task information.
     * @returns {string}
     */
    getInfo() {

        return `Task: ${this.title} - Priority: ${this.priority}`;

    }

    /**
     * Hands out the next sequential id.
     * @returns {number}
     */
    static #nextId() {

        Task.#idCounter += 1;

        return Task.#idCounter;

    }

    /**
     * Resets the id counter back to zero.
     * Used only for testing / explicit app resets.
     */
    static resetIdCounter() {

        Task.#idCounter = 0;

    }

    /**
     * Ensures the id counter is never lower than an existing task's
     * id. Used after restoring tasks from storage, where the counter
     * would otherwise reset to 0 on every page load and could hand
     * out a duplicate id to the next new task.
     * @param {number} minimumValue
     */
    static raiseIdCounterFloor(minimumValue) {

        if (typeof minimumValue !== "number" || Number.isNaN(minimumValue)) {
            return;
        }

        if (minimumValue > Task.#idCounter) {
            Task.#idCounter = minimumValue;
        }

    }

}

/*==================================================
  SubTask Class
==================================================*/

/**
 * Represents a subtask.
 * Inherits from Task.
 */
class SubTask extends Task {

    /**
     * Create a subtask.
     * @param {string} title
     * @param {string} description
     * @param {number} priority
     * @param {number} parentTask
     * @throws {Error} If parentTask is missing.
     */
    constructor(title, description, priority, parentTask) {

        super(title, description, priority);

        if (
            parentTask === undefined ||
            parentTask === null
        ) {
            throw new Error(ERROR_MESSAGES.MISSING_PARENT);
        }

        this.parentTask = parentTask;

    }

}

/*==================================================
  Higher-Order Utility
==================================================*/

/**
 * Higher-order function: takes a predicate and returns a reusable,
 * named filter function for task arrays. This keeps the "what am I
 * filtering for" decision (the predicate) separate from the "how do
 * I filter an array of tasks" mechanics (the returned function),
 * and lets both be composed and unit-tested independently.
 * @param {(task: Task) => boolean} predicate
 * @returns {(tasks: Task[]) => Task[]}
 * @throws {TypeError} If predicate is not a function.
 */
function createTaskFilter(predicate) {

    if (typeof predicate !== "function") {
        throw new TypeError(ERROR_MESSAGES.PREDICATE_REQUIRED);
    }

    return function filterTasks(tasks) {

        if (!Array.isArray(tasks)) {
            throw new TypeError(ERROR_MESSAGES.INVALID_TASKS_ARRAY);
        }

        return tasks.filter(predicate);

    };

}

/** Filter for completed tasks, built from createTaskFilter(). */
const filterCompletedTasks = createTaskFilter(task => task.completed);

/** Filter for pending (not completed) tasks, built from createTaskFilter(). */
const filterPendingTasks = createTaskFilter(task => !task.completed);

/*==================================================
  Task Functions (pure - operate on a passed-in array)
==================================================*/

/**
 * Finds a task by its title.
 * @param {Task[]} tasks
 * @param {string} title
 * @returns {Task|undefined}
 * @throws {TypeError} If tasks or title are the wrong type.
 */
function findTaskByTitle(tasks, title) {

    if (!Array.isArray(tasks)) {
        throw new TypeError(ERROR_MESSAGES.INVALID_TASKS_ARRAY);
    }

    if (typeof title !== "string") {
        throw new TypeError(ERROR_MESSAGES.INVALID_TITLE_TYPE);
    }

    const trimmedTitle = title.trim();

    return tasks.find(task => task.title === trimmedTitle);

}

/**
 * Updates a task's priority in place.
 * Uses Array.prototype.find instead of an index-based loop.
 * @param {Task[]} tasks
 * @param {number} taskId
 * @param {number} newPriority
 * @returns {boolean} Whether a matching task was found and updated.
 * @throws {TypeError} If tasks, taskId, or newPriority are the wrong type.
 * @throws {RangeError} If newPriority is out of range.
 */
function updateTaskPriority(tasks, taskId, newPriority) {

    if (!Array.isArray(tasks)) {
        throw new TypeError(ERROR_MESSAGES.INVALID_TASKS_ARRAY);
    }

    if (
        typeof taskId !== "number" ||
        typeof newPriority !== "number"
    ) {
        throw new TypeError(ERROR_MESSAGES.INVALID_ID_OR_PRIORITY_TYPE);
    }

    if (
        newPriority < PRIORITY_MIN ||
        newPriority > PRIORITY_MAX
    ) {
        throw new RangeError(ERROR_MESSAGES.INVALID_PRIORITY);
    }

    const task = tasks.find(candidate => candidate.id === taskId);

    if (!task) {
        return false;
    }

    task.priority = newPriority;

    return true;

}

/**
 * Returns task details.
 * Uses object destructuring as required.
 * @param {Task} task
 * @returns {Object}
 * @throws {TypeError} If task is not a valid object.
 */
function getTaskDetails(task) {

    if (!task || typeof task !== "object") {
        throw new TypeError(ERROR_MESSAGES.INVALID_TASK_OBJECT);
    }

    const {
        title,
        description,
        priority,
        completed
    } = task;

    return {
        title,
        description,
        priority,
        completed
    };

}

/**
 * Merges any number of task lists.
 * Uses a rest parameter to collect array arguments, then flattens.
 * @param {...Task[]} lists
 * @returns {Task[]}
 * @throws {TypeError} If any argument is not an array.
 */
function mergeTasks(...lists) {

    if (!lists.every(list => Array.isArray(list))) {
        throw new TypeError(ERROR_MESSAGES.INVALID_LISTS);
    }

    return lists.flat();

}

/**
 * Recursively counts completed tasks.
 * @param {Task[]} tasks
 * @param {number} index
 * @returns {number}
 */
function countCompletedTasks(tasks, index = 0) {

    if (!Array.isArray(tasks)) {
        return 0;
    }

    // Base case

    if (index >= tasks.length) {
        return 0;
    }

    if (tasks[index].completed) {

        return 1 + countCompletedTasks(
            tasks,
            index + 1
        );

    }

    return countCompletedTasks(
        tasks,
        index + 1
    );

}

/**
 * Calculates the average priority of a task list.
 * Takes the list as a parameter rather than reading shared state,
 * so it can be reused (and tested) against any array of tasks.
 * @param {Task[]} tasks
 * @returns {number}
 * @throws {TypeError} If tasks is not an array.
 */
function calculateAveragePriority(tasks) {

    if (!Array.isArray(tasks)) {
        throw new TypeError(ERROR_MESSAGES.INVALID_TASKS_ARRAY);
    }

    if (tasks.length === 0) {
        return 0;
    }

    const total = tasks.reduce(
        (sum, task) => sum + task.priority,
        0
    );

    return Math.round(total / tasks.length);

}

/**
 * Returns all tasks above the minimum priority.
 * Takes the list as a parameter (rather than reading shared state)
 * and is built on top of the createTaskFilter higher-order function.
 * @param {Task[]} tasks
 * @param {number} minPriority
 * @returns {Task[]}
 * @throws {TypeError} If tasks or minPriority are the wrong type.
 */
function getHighPriorityTasks(tasks, minPriority) {

    if (typeof minPriority !== "number") {
        throw new TypeError(ERROR_MESSAGES.INVALID_MIN_PRIORITY);
    }

    const isAboveMinPriority = createTaskFilter(
        task => task.priority > minPriority
    );

    return isAboveMinPriority(tasks);

}

/**
 * Returns a shallow copy of a task list.
 * Demonstrates the array spread operator.
 * @param {Task[]} tasks
 * @returns {Task[]}
 * @throws {TypeError} If tasks is not an array.
 */
function cloneTaskList(tasks) {

    if (!Array.isArray(tasks)) {
        throw new TypeError(ERROR_MESSAGES.INVALID_TASKS_ARRAY);
    }

    return [...tasks];

}

/**
 * Returns a new task-like object with overridden properties.
 * Demonstrates the object spread operator.
 * @param {Task} task
 * @param {Object} overrides
 * @returns {Object}
 * @throws {TypeError} If task is not a valid object.
 */
function duplicateTaskWithChanges(task, overrides = {}) {

    if (!task || typeof task !== "object") {
        throw new TypeError(ERROR_MESSAGES.INVALID_TASK_OBJECT);
    }

    return {
        ...task,
        ...overrides
    };

}

/**
 * Splits a task list into its first task and the rest.
 * Demonstrates array destructuring with a rest pattern.
 * @param {Task[]} tasks
 * @returns {{ firstTask: Task|undefined, remainingTasks: Task[] }}
 * @throws {TypeError} If tasks is not an array.
 */
function splitFirstTask(tasks) {

    if (!Array.isArray(tasks)) {
        throw new TypeError(ERROR_MESSAGES.INVALID_TASKS_ARRAY);
    }

    const [firstTask, ...remainingTasks] = tasks;

    return { firstTask, remainingTasks };

}

/**
 * Returns a task manager summary using object destructuring
 * on the function parameter itself.
 * @param {{ tasks: Task[] }} manager
 * @returns {number}
 * @throws {TypeError} If manager doesn't have a tasks array.
 */
function getManagerTaskCount({ tasks } = {}) {

    if (!Array.isArray(tasks)) {
        throw new TypeError(ERROR_MESSAGES.MANAGER_SHAPE);
    }

    return tasks.length;

}

/**
 * Picks a subset of fields off a task-like object.
 * Demonstrates a rest parameter collecting individual string
 * arguments (as opposed to mergeTasks, whose rest parameter
 * collects array arguments).
 * @param {Object} task
 * @param {...string} fields
 * @returns {Object}
 * @throws {TypeError} If task is invalid or no fields are given.
 */
function pickTaskFields(task, ...fields) {

    if (!task || typeof task !== "object") {
        throw new TypeError(ERROR_MESSAGES.INVALID_TASK_OBJECT);
    }

    if (fields.length === 0) {
        throw new TypeError(ERROR_MESSAGES.FIELDS_REQUIRED);
    }

    return fields.reduce((picked, field) => {

        if (field in task) {
            picked[field] = task[field];
        }

        return picked;

    }, {});

}

/*==================================================
  Task Manager Class
==================================================*/

/**
 * Owns the application's task collection.
 * State (#tasks) is a private field: nothing outside this class
 * can reach in and mutate the array directly, only through the
 * methods below - each of which delegates to the pure functions
 * above, passing in the private array explicitly.
 */
class TaskManager {

    /** @type {Task[]} */
    #tasks = [];

    /**
     * Creates and stores a new task.
     * @param {string} title
     * @param {string} description
     * @param {number} priority
     * @returns {Task|null} The created task, or null if creation failed.
     */
    add(title, description, priority) {

        try {

            const newTask = new Task(title, description, priority);

            this.#tasks.push(newTask);

            return newTask;

        } catch (error) {

            console.error(`${ERROR_MESSAGES.ADD_TASK_FAILED}: ${error.message}`);

            return null;

        }

    }

    /**
     * Removes a task by id.
     * @param {number} taskId
     * @returns {boolean} Whether a task was found and removed.
     */
    remove(taskId) {

        const index = this.#tasks.findIndex(task => task.id === taskId);

        if (index === -1) {
            return false;
        }

        this.#tasks.splice(index, 1);

        return true;

    }

    /**
     * Finds a task by title.
     * @param {string} title
     * @returns {Task|undefined}
     */
    findByTitle(title) {

        return findTaskByTitle(this.#tasks, title);

    }

    /**
     * Finds a task by id.
     * @param {number} taskId
     * @returns {Task|undefined}
     */
    findById(taskId) {

        return this.#tasks.find(task => task.id === taskId);

    }

    /**
     * Updates a task's priority.
     * @param {number} taskId
     * @param {number} newPriority
     * @returns {boolean}
     */
    updatePriority(taskId, newPriority) {

        return updateTaskPriority(this.#tasks, taskId, newPriority);

    }

    /**
     * Toggles a task's completion status by id.
     * @param {number} taskId
     * @returns {boolean} Whether a matching task was found.
     */
    toggleCompletion(taskId) {

        const task = this.findById(taskId);

        if (!task) {
            return false;
        }

        task.toggleCompletion();

        return true;

    }

    /**
     * A defensive, read-only copy of the current tasks.
     * Exposed as a getter (not a plain public field) so external
     * code can read the state but never obtains a reference it
     * could mutate the private array through.
     * @returns {Task[]}
     */
    get tasks() {

        return [...this.#tasks];

    }

    /**
     * Total number of tasks currently held.
     * @returns {number}
     */
    get totalTasks() {

        return this.#tasks.length;

    }

    /**
     * All completed tasks.
     * @returns {Task[]}
     */
    getCompletedTasks() {

        return filterCompletedTasks(this.#tasks);

    }

    /**
     * All pending (not completed) tasks.
     * @returns {Task[]}
     */
    getPendingTasks() {

        return filterPendingTasks(this.#tasks);

    }

    /**
     * Titles of every task currently held.
     * @returns {string[]}
     */
    getTaskTitles() {

        return this.#tasks.map(task => task.title);

    }

    /**
     * Sum of every task's priority.
     * @returns {number}
     */
    getTotalPriority() {

        return this.#tasks.reduce(
            (total, task) => total + task.priority,
            0
        );

    }

    /**
     * Average priority across every task.
     * @returns {number}
     */
    getAveragePriority() {

        return calculateAveragePriority(this.#tasks);

    }

    /**
     * All tasks above the given minimum priority.
     * @param {number} minPriority
     * @returns {Task[]}
     */
    getHighPriorityTasks(minPriority) {

        return getHighPriorityTasks(this.#tasks, minPriority);

    }

    /**
     * A snapshot summary of the manager's current state.
     * Demonstrates building a new object with the spread operator
     * on top of a base stats object.
     * @returns {{ total: number, completed: number, pending: number, averagePriority: number, generatedAt: string }}
     */
    getSummary() {

        const baseStats = {
            total: this.totalTasks,
            completed: this.getCompletedTasks().length,
            pending: this.getPendingTasks().length,
            averagePriority: this.getAveragePriority()
        };

        return {
            ...baseStats,
            generatedAt: new Date().toISOString()
        };

    }

    /**
     * Replaces the current tasks with ones restored from storage,
     * skipping any that fail validation instead of crashing the
     * whole app on load.
     * @param {Array} savedTasks
     */
    restore(savedTasks) {

        if (!Array.isArray(savedTasks)) {
            return;
        }

        this.#tasks.length = 0;

        savedTasks.forEach(saved => {

            try {

                const restoredTask = new Task(
                    saved?.title,
                    saved?.description,
                    saved?.priority
                );

                restoredTask.id = saved.id;
                restoredTask.completed = Boolean(saved.completed);

                this.#tasks.push(restoredTask);

            } catch (error) {

                console.error(`${ERROR_MESSAGES.SKIPPED_CORRUPT_TASK}: ${error.message}`);

            }

        });

        // Prevent duplicate ids: make sure the counter is at least
        // as high as the largest id we just restored.
        const highestId = this.#tasks.reduce(
            (max, task) => Math.max(max, task.id),
            0
        );

        Task.raiseIdCounterFloor(highestId);

    }

    /**
     * Clears all tasks and resets id generation.
     * Used for testing / explicit app resets.
     */
    reset() {

        this.#tasks.length = 0;

        Task.resetIdCounter();

    }

}

/** The application's single, shared TaskManager instance. */
const taskManager = new TaskManager();

/**
 * Resets the shared task manager.
 * Kept as a standalone function (delegating to taskManager.reset())
 * for convenience in tests.
 */
function resetTaskManager() {

    taskManager.reset();

}

/*==================================================
  Module Exports
==================================================*/

export {

    Task,

    SubTask,

    taskManager,

    createTaskFilter,

    filterCompletedTasks,

    filterPendingTasks,

    findTaskByTitle,

    updateTaskPriority,

    getTaskDetails,

    mergeTasks,

    countCompletedTasks,

    calculateAveragePriority,

    getHighPriorityTasks,

    cloneTaskList,

    duplicateTaskWithChanges,

    splitFirstTask,

    getManagerTaskCount,

    pickTaskFields,

    TaskManager,

    resetTaskManager

};
