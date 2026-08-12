"use strict";

/*
====================================================
Application Constants
Centralized limits and error messages so every module
throws/logs consistent, easily-maintained text instead
of repeating string literals throughout the codebase.
====================================================
*/

/** Minimum allowed task priority (inclusive). */
const PRIORITY_MIN = 1;

/** Maximum allowed task priority (inclusive). */
const PRIORITY_MAX = 5;

/**
 * Centralized, frozen error message catalogue.
 * Frozen so a module can't accidentally mutate a shared message
 * at runtime.
 */
const ERROR_MESSAGES = Object.freeze({
    EMPTY_TITLE: "Task title cannot be empty.",
    INVALID_DESCRIPTION: "Description must be a string.",
    INVALID_PRIORITY: `Priority must be between ${PRIORITY_MIN} and ${PRIORITY_MAX}.`,
    MISSING_PARENT: "Parent task ID is required.",
    INVALID_TITLE_TYPE: "Title must be a string.",
    INVALID_ID_OR_PRIORITY_TYPE: "Task ID and priority must be numbers.",
    INVALID_TASKS_ARRAY: "Expected an array of tasks.",
    INVALID_TASK_OBJECT: "A valid task object is required.",
    INVALID_LISTS: "All arguments must be arrays.",
    INVALID_MIN_PRIORITY: "Minimum priority must be a number.",
    PREDICATE_REQUIRED: "A predicate function is required.",
    FIELDS_REQUIRED: "At least one field name is required.",
    MANAGER_SHAPE: "Expected an object with a tasks array.",
    UNABLE_TO_SAVE: "Unable to save tasks",
    UNABLE_TO_LOAD: "Unable to load tasks",
    SKIPPED_CORRUPT_TASK: "Skipped a corrupted saved task",
    ADD_TASK_FAILED: "Error adding task"
});

export { PRIORITY_MIN, PRIORITY_MAX, ERROR_MESSAGES };
