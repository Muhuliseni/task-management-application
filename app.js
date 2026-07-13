"use strict";

/*
====================================================
Task Management Application
Core Application Logic
====================================================
*/

/*==================================================
  Global Variables
==================================================*/

/**
 * Stores all created tasks.
 * Using let because tasks will be added and removed.
 */
let taskList = [];

/**
 * Tracks the latest task ID.
 */
let taskCounter = 0;

/*==================================================
  Task Class
==================================================*/

/**
 * Represents a single task.
 */
class Task {

    /**
     * Create a new task.
     * @param {string} title
     * @param {string} description
     * @param {number} priority
     */
    constructor(title, description, priority) {

        // Defensive programming

        if (typeof title !== "string" || title.trim() === "") {
            throw new Error("Task title cannot be empty.");
        }

        if (typeof description !== "string") {
            throw new Error("Description must be a string.");
        }

        if (
            typeof priority !== "number" ||
            Number.isNaN(priority) ||
            priority < 1 ||
            priority > 5
        ) {
            throw new Error("Priority must be between 1 and 5.");
        }

        // Unique ID

        this.id = ++taskCounter;

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
     */
    constructor(title, description, priority, parentTask) {

        super(title, description, priority);

        if (
            parentTask === undefined ||
            parentTask === null
        ) {
            throw new Error("Parent task ID is required.");
        }

        this.parentTask = parentTask;

    }

}
/*==================================================
  Task Functions
==================================================*/

/**
 * Adds a new task to the task list.
 * @param {string} title
 * @param {string} description
 * @param {number} priority
 * @returns {Task|null}
 */
function addTask(title, description, priority) {

    try {

        const newTask = new Task(title, description, priority);

        taskList.push(newTask);

        return newTask;

    } catch (error) {

        console.error(`Error adding task: ${error.message}`);
        return null;

    }

}

/**
 * Displays all tasks in the console.
 */
function displayAllTasks() {

    if (taskList.length === 0) {
        console.log("No tasks available.");
        return;
    }

    for (const task of taskList) {

        console.log(task.getInfo());

    }

}

/**
 * Finds a task by its title.
 * @param {string} title
 * @returns {Task|undefined}
 */
function findTaskByTitle(title) {

    if (typeof title !== "string") {
        throw new TypeError("Title must be a string.");
    }

    let i = 0;

    while (i < taskList.length) {

        if (taskList[i].title === title.trim()) {

            return taskList[i];

        }

        i++;

    }

    return undefined;

}

/**
 * Updates a task's priority.
 * @param {number} taskId
 * @param {number} newPriority
 * @returns {boolean}
 */
function updateTaskPriority(taskId, newPriority) {

    if (
        typeof taskId !== "number" ||
        typeof newPriority !== "number"
    ) {
        throw new TypeError("Task ID and priority must be numbers.");
    }

    if (
        newPriority < 1 ||
        newPriority > 5
    ) {
        throw new RangeError("Priority must be between 1 and 5.");
    }

    for (let i = 0; i < taskList.length; i++) {

        if (taskList[i].id === taskId) {

            taskList[i].priority = newPriority;

            return true;

        }

    }

    return false;

}
/**
 * Returns task details.
 * Uses object destructuring as required.
 * @param {Task} task
 * @returns {Object}
 */
function getTaskDetails(task) {

    if (!task || typeof task !== "object") {
        throw new Error("A valid task object is required.");
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
 * Merges two task lists.
 * Uses spread operator as required.
 * @param {Task[]} list1
 * @param {Task[]} list2
 * @returns {Task[]}
 */
function mergeTasks(...lists) {

    if (!lists.every(list => Array.isArray(list))) {
        throw new TypeError("All arguments must be arrays.");
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
 * Calculates the average priority.
 * Uses Math.round().
 * @returns {number}
 */
function calculateAveragePriority() {

    if (taskList.length === 0) {
        return 0;
    }

    let total = 0;

    for (const task of taskList) {

        total += task.priority;

    }

    return Math.round(
        total / taskList.length
    );

}

/**
 * Returns all tasks above the minimum priority.
 * Uses filter() as required.
 * @param {number} minPriority
 * @returns {Task[]}
 */
function getHighPriorityTasks(minPriority) {

    if (typeof minPriority !== "number") {
        throw new TypeError(
            "Minimum priority must be a number."
        );
    }

    return taskList.filter(
        task => task.priority > minPriority
    );

}
/*==================================================
  Task Manager Object
==================================================*/

const TaskManager = {

    /**
     * Reference to the application's task list.
     */
    tasks: taskList,

    /**
     * Adds a task using the existing addTask function.
     * Demonstrates a functional approach.
     * @param {string} title
     * @param {string} description
     * @param {number} priority
     * @returns {Task|null}
     */
    add(title, description, priority) {

        return addTask(title, description, priority);

    },

    /**
     * Returns the total number of tasks.
     * @returns {number}
     */
    getTotalTasks() {

        return this.tasks.length;

    },

    /**
     * Returns all completed tasks.
     * Uses filter().
     * @returns {Task[]}
     */
    getCompletedTasks() {

        return this.tasks.filter(task => task.completed);

    },

    /**
     * Returns all pending tasks.
     * Uses filter().
     * @returns {Task[]}
     */
    getPendingTasks() {

        return this.tasks.filter(task => !task.completed);

    },

    /**
     * Returns task titles.
     * Uses map().
     * @returns {string[]}
     */
    getTaskTitles() {

        return this.tasks.map(task => task.title);

    },

    /**
     * Calculates the total priority score.
     * Uses reduce().
     * @returns {number}
     */
    getTotalPriority() {

        return this.tasks.reduce(

            (total, task) => total + task.priority,

            0

        );

    }

};

/*==================================================
  Testing Utility
==================================================*/

/**
 * Resets application state.
 * Used only for testing.
 */
function resetTaskManager() {

    taskList.length = 0;
    taskCounter = 0;

}

/*==================================================
  Module Exports
==================================================*/

export {

    taskList,

    taskCounter,

    Task,

    SubTask,

    addTask,

    displayAllTasks,

    findTaskByTitle,

    updateTaskPriority,

    getTaskDetails,

    mergeTasks,

    countCompletedTasks,

    calculateAveragePriority,

    getHighPriorityTasks,

    TaskManager,

    resetTaskManager

};