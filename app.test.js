import {

    Task,

    SubTask,

    taskManager,

    resetTaskManager,

    createTaskFilter,

    filterCompletedTasks,

    filterPendingTasks,

    findTaskByTitle,

    updateTaskPriority,

    calculateAveragePriority,

    getTaskDetails,

    mergeTasks,

    countCompletedTasks,

    getHighPriorityTasks,

    cloneTaskList,

    duplicateTaskWithChanges,

    splitFirstTask,

    getManagerTaskCount,

    pickTaskFields

} from "./app.js";
import {
    priorities,
    generateRandomId,
    formatTaskName,
    isHighPriority,
    recursiveCount,
    getFormattedTaskNames,
    getCompletedTasks,
    calculateTotalPriority
} from "./utils.js";

describe("Task Class", () => {

    beforeEach(() => {

        resetTaskManager();

    });

    test("should create a task", () => {

        const task = new Task(

            "Test Task",

            "Description",

            3

        );

        expect(task.title).toBe("Test Task");

        expect(task.description).toBe("Description");

        expect(task.priority).toBe(3);

        expect(task.completed).toBe(false);

        expect(task.id).toBeDefined();

    });

    test("should return task information", () => {

        const task = new Task(

            "Homework",

            "Math",

            2

        );

        expect(task.getInfo()).toContain("Homework");

    });

    test("should toggle completion", () => {

        const task = new Task(

            "Homework",

            "Math",

            2

        );

        expect(task.completed).toBe(false);

        task.toggleCompletion();

        expect(task.completed).toBe(true);

    });

    test("should throw for an empty title", () => {

        expect(() => new Task("   ", "Description", 3)).toThrow(
            "Task title cannot be empty."
        );

    });

    test("should throw for a non-string description", () => {

        expect(() => new Task("Title", 42, 3)).toThrow(
            "Description must be a string."
        );

    });

    test("should throw for an out-of-range priority", () => {

        expect(() => new Task("Title", "Description", 9)).toThrow(
            "Priority must be between 1 and 5."
        );

    });

    test("should assign sequential, non-repeating ids", () => {

        const first = new Task("First", "Description", 1);
        const second = new Task("Second", "Description", 1);

        expect(second.id).toBe(first.id + 1);

    });

});
describe("SubTask Class", () => {

    beforeEach(() => {

        resetTaskManager();

    });

    test("should inherit from Task", () => {

        const parentTask = new Task(
            "Main Task",
            "Main Description",
            3
        );

        const subTask = new SubTask(
            "Sub Task",
            "Sub Description",
            2,
            parentTask
        );

        expect(subTask).toBeInstanceOf(SubTask);
        expect(subTask).toBeInstanceOf(Task);

        expect(subTask.parentTask).toBe(parentTask);

        expect(subTask.title).toBe("Sub Task");

        expect(subTask.completed).toBe(false);

    });

    test("should throw when parentTask is missing", () => {

        expect(
            () => new SubTask("Sub Task", "Description", 2, undefined)
        ).toThrow("Parent task ID is required.");

    });

});

describe("TaskManager", () => {

    beforeEach(() => {

        resetTaskManager();

    });

    test("should add a task", () => {

        const task = taskManager.add(
            "New Task",
            "Testing",
            2
        );

        expect(taskManager.totalTasks).toBe(1);

        expect(task.title).toBe("New Task");

        expect(task.priority).toBe(2);

    });

    test("should return null instead of throwing when task creation fails", () => {

        const result = taskManager.add("", "Description", 3);

        expect(result).toBeNull();

        expect(taskManager.totalTasks).toBe(0);

    });

    test("tasks getter should return a copy, not the private array itself", () => {

        taskManager.add("Task 1", "Description", 2);

        const snapshot = taskManager.tasks;

        snapshot.pop();

        expect(taskManager.totalTasks).toBe(1);

    });

    test("should find a task by title", () => {

        taskManager.add("Homework", "Math", 3);

        const task = taskManager.findByTitle("Homework");

        expect(task).toBeDefined();
        expect(task.title).toBe("Homework");

    });

    test("should find a task by id", () => {

        const task = taskManager.add("Homework", "Math", 3);

        expect(taskManager.findById(task.id)).toBe(task);

    });

    test("should update a task's priority", () => {

        const task = taskManager.add("Assignment", "Programming", 2);

        const updated = taskManager.updatePriority(task.id, 5);

        expect(updated).toBe(true);
        expect(task.priority).toBe(5);

    });

    test("should return false when updating priority for an unknown id", () => {

        expect(taskManager.updatePriority(9999, 5)).toBe(false);

    });

    test("should toggle a task's completion by id", () => {

        const task = taskManager.add("Task", "Description", 2);

        expect(taskManager.toggleCompletion(task.id)).toBe(true);
        expect(task.completed).toBe(true);

    });

    test("should return false when toggling an unknown id", () => {

        expect(taskManager.toggleCompletion(9999)).toBe(false);

    });

    test("should remove a task by id", () => {

        const task = taskManager.add("Task", "Description", 2);

        expect(taskManager.remove(task.id)).toBe(true);
        expect(taskManager.totalTasks).toBe(0);

    });

    test("should return false when removing an unknown id", () => {

        expect(taskManager.remove(9999)).toBe(false);

    });

    test("should report completed and pending tasks separately", () => {

        const task1 = taskManager.add("Task 1", "Description", 1);
        taskManager.add("Task 2", "Description", 3);

        taskManager.toggleCompletion(task1.id);

        expect(taskManager.getCompletedTasks()).toHaveLength(1);
        expect(taskManager.getPendingTasks()).toHaveLength(1);

    });

    test("should return task titles", () => {

        taskManager.add("Task 1", "Description", 1);
        taskManager.add("Task 2", "Description", 2);

        expect(taskManager.getTaskTitles()).toEqual(["Task 1", "Task 2"]);

    });

    test("should calculate total and average priority", () => {

        taskManager.add("Task 1", "Description", 2);
        taskManager.add("Task 2", "Description", 4);

        expect(taskManager.getTotalPriority()).toBe(6);
        expect(taskManager.getAveragePriority()).toBe(3);

    });

    test("should return high priority tasks", () => {

        taskManager.add("Low", "Description", 1);
        const high = taskManager.add("High", "Description", 5);

        const results = taskManager.getHighPriorityTasks(3);

        expect(results).toHaveLength(1);
        expect(results[0]).toBe(high);

    });

    test("getSummary should reflect current stats", () => {

        const task = taskManager.add("Task 1", "Description", 4);
        taskManager.toggleCompletion(task.id);

        const summary = taskManager.getSummary();

        expect(summary).toMatchObject({
            total: 1,
            completed: 1,
            pending: 0,
            averagePriority: 4
        });

        expect(typeof summary.generatedAt).toBe("string");

    });

    test("restore should rebuild tasks from saved data", () => {

        taskManager.restore([
            { id: 5, title: "Restored", description: "From storage", priority: 3, completed: true }
        ]);

        expect(taskManager.totalTasks).toBe(1);
        expect(taskManager.tasks[0].id).toBe(5);
        expect(taskManager.tasks[0].completed).toBe(true);

    });

    test("restore should skip corrupted entries instead of throwing", () => {

        taskManager.restore([
            { id: 1, title: "Valid", description: "ok", priority: 2, completed: false },
            { id: 2, title: "", description: "bad title", priority: 2, completed: false }
        ]);

        expect(taskManager.totalTasks).toBe(1);
        expect(taskManager.tasks[0].title).toBe("Valid");

    });

    test("restore should raise the id counter so new tasks never collide", () => {

        taskManager.restore([
            { id: 50, title: "Restored", description: "", priority: 1, completed: false }
        ]);

        const newTask = taskManager.add("New", "Description", 1);

        expect(newTask.id).toBeGreaterThan(50);

    });

});
describe("Higher-Order Filters", () => {

    test("createTaskFilter should build a reusable filter function", () => {

        const isHighPriorityTask = createTaskFilter(task => task.priority >= 4);

        const tasks = [
            { priority: 1 },
            { priority: 5 }
        ];

        expect(isHighPriorityTask(tasks)).toEqual([{ priority: 5 }]);

    });

    test("createTaskFilter should throw for a non-function predicate", () => {

        expect(() => createTaskFilter("not a function")).toThrow(
            "A predicate function is required."
        );

    });

    test("the filter it returns should throw for a non-array argument", () => {

        const filterFn = createTaskFilter(task => task.completed);

        expect(() => filterFn("not an array")).toThrow(
            "Expected an array of tasks."
        );

    });

    test("filterCompletedTasks and filterPendingTasks should partition a list", () => {

        const tasks = [
            { completed: true },
            { completed: false }
        ];

        expect(filterCompletedTasks(tasks)).toHaveLength(1);
        expect(filterPendingTasks(tasks)).toHaveLength(1);

    });

});

describe("Task Functions", () => {

    beforeEach(() => {

        resetTaskManager();

    });

    test("should find task by title", () => {

        taskManager.add("Homework", "Math", 3);

        const task = findTaskByTitle(taskManager.tasks, "Homework");

        expect(task).toBeDefined();

        expect(task.title).toBe("Homework");

    });

    test("should return undefined for missing task", () => {

        const task = findTaskByTitle(taskManager.tasks, "Unknown");

        expect(task).toBeUndefined();

    });

    test("should throw when tasks argument is not an array", () => {

        expect(() => findTaskByTitle(null, "Homework")).toThrow(
            "Expected an array of tasks."
        );

    });

    test("should throw when title argument is not a string", () => {

        expect(() => findTaskByTitle([], 123)).toThrow(
            "Title must be a string."
        );

    });

    test("should update task priority using Array.prototype.find", () => {

        const task = taskManager.add("Assignment", "Programming", 2);

        const updated = updateTaskPriority(taskManager.tasks, task.id, 5);

        expect(updated).toBe(true);

    });

    test("should return false for invalid id", () => {

        const updated = updateTaskPriority(taskManager.tasks, 9999, 5);

        expect(updated).toBe(false);

    });

    test("should throw a TypeError for non-numeric id or priority", () => {

        expect(() => updateTaskPriority(taskManager.tasks, "1", 5)).toThrow(TypeError);

    });

    test("should throw a RangeError for an out-of-range priority", () => {

        const task = taskManager.add("Assignment", "Programming", 2);

        expect(() => updateTaskPriority(taskManager.tasks, task.id, 10)).toThrow(RangeError);

    });

    test("should calculate average priority", () => {

        taskManager.add("Task 1", "Description", 2);
        taskManager.add("Task 2", "Description", 4);

        expect(
            calculateAveragePriority(taskManager.tasks)
        ).toBe(3);

    });

    test("should return 0 average priority for an empty list", () => {

        expect(calculateAveragePriority([])).toBe(0);

    });

    test("calculateAveragePriority should throw for a non-array argument", () => {

        expect(() => calculateAveragePriority("nope")).toThrow(TypeError);

    });

});
describe("Array Operations", () => {

    beforeEach(() => {

        resetTaskManager();

    });

    test("should merge two task arrays", () => {

        const task1 = new Task(
            "Task 1",
            "Description 1",
            2
        );

        const task2 = new Task(
            "Task 2",
            "Description 2",
            4
        );

        const merged = mergeTasks(
            [task1],
            [task2]
        );

        expect(merged).toHaveLength(2);

        expect(merged).toContain(task1);

        expect(merged).toContain(task2);

    });

    test("mergeTasks should throw when an argument is not an array", () => {

        expect(() => mergeTasks([1, 2], "not an array")).toThrow(TypeError);

    });

    test("should return task details using destructuring", () => {

        const task = new Task(
            "Homework",
            "Math",
            3
        );

        const details = getTaskDetails(task);

        expect(details).toEqual({

            title: "Homework",

            description: "Math",

            priority: 3,

            completed: false

        });

    });

    test("getTaskDetails should throw for an invalid task", () => {

        expect(() => getTaskDetails(null)).toThrow(TypeError);

    });

    test("should count completed tasks recursively", () => {

        const task1 = taskManager.add(
            "Task 1",
            "Description",
            1
        );

        const task2 = taskManager.add(
            "Task 2",
            "Description",
            3
        );

        const task3 = taskManager.add(
            "Task 3",
            "Description",
            5
        );

        taskManager.toggleCompletion(task1.id);
        taskManager.toggleCompletion(task3.id);

        expect(

            countCompletedTasks(taskManager.tasks)

        ).toBe(2);

    });

    test("should return high priority tasks", () => {

        taskManager.add(
            "Low",
            "Description",
            1
        );

        const highTask = taskManager.add(
            "High",
            "Description",
            5
        );

        const results = getHighPriorityTasks(taskManager.tasks, 3);

        expect(results).toHaveLength(1);

        expect(results[0]).toBe(highTask);

    });

    test("should return empty array when no high priority tasks exist", () => {

        taskManager.add(
            "Task",
            "Description",
            2
        );

        expect(

            getHighPriorityTasks(taskManager.tasks, 4)

        ).toEqual([]);

    });

    test("getHighPriorityTasks should throw for a non-numeric minPriority", () => {

        expect(() => getHighPriorityTasks(taskManager.tasks, "3")).toThrow(TypeError);

    });

});
describe("Error Handling", () => {

    beforeEach(() => {

        resetTaskManager();

    });

    test("should return null when task title is invalid", () => {

        const result = taskManager.add("", "Description", 3);

        expect(result).toBeNull();

    });

    test("should return null for invalid priority", () => {

        const result = taskManager.add(
            "Task",
            "Description",
            10
        );

        expect(result).toBeNull();

    });

});

describe("Spread and Destructuring", () => {

    beforeEach(() => {
        resetTaskManager();
    });

    test("cloneTaskList should return a shallow copy using spread", () => {

        taskManager.add("Task 1", "Description", 2);

        const clone = cloneTaskList(taskManager.tasks);

        expect(clone).toEqual(taskManager.tasks);
        expect(clone).not.toBe(taskManager.tasks);

    });

    test("cloneTaskList should throw for a non-array argument", () => {

        expect(() => cloneTaskList("nope")).toThrow(TypeError);

    });

    test("duplicateTaskWithChanges should merge properties using object spread", () => {

        const task = taskManager.add("Task 1", "Description", 2);

        const updated = duplicateTaskWithChanges(task, { priority: 5 });

        expect(updated.title).toBe("Task 1");
        expect(updated.priority).toBe(5);

    });

    test("duplicateTaskWithChanges should throw for an invalid task", () => {

        expect(() => duplicateTaskWithChanges(null)).toThrow(TypeError);

    });

    test("splitFirstTask should destructure the first task and the rest", () => {

        const task1 = taskManager.add("Task 1", "Description", 1);
        const task2 = taskManager.add("Task 2", "Description", 2);

        const { firstTask, remainingTasks } = splitFirstTask(taskManager.tasks);

        expect(firstTask).toBe(task1);
        expect(remainingTasks).toEqual([task2]);

    });

    test("splitFirstTask should throw for a non-array argument", () => {

        expect(() => splitFirstTask(null)).toThrow(TypeError);

    });

    test("getManagerTaskCount should destructure its parameter", () => {

        taskManager.add("Task 1", "Description", 1);
        taskManager.add("Task 2", "Description", 2);

        expect(
            getManagerTaskCount({ tasks: taskManager.tasks })
        ).toBe(2);

    });

    test("getManagerTaskCount should throw when tasks is missing", () => {

        expect(() => getManagerTaskCount({})).toThrow(TypeError);

    });

    test("pickTaskFields should pick only the requested fields", () => {

        const task = taskManager.add("Task 1", "Description", 4);

        const picked = pickTaskFields(task, "title", "priority");

        expect(picked).toEqual({ title: "Task 1", priority: 4 });

    });

    test("pickTaskFields should throw when no fields are given", () => {

        const task = taskManager.add("Task 1", "Description", 4);

        expect(() => pickTaskFields(task)).toThrow(TypeError);

    });

    test("pickTaskFields should throw for an invalid task", () => {

        expect(() => pickTaskFields(null, "title")).toThrow(TypeError);

    });

});

describe("Utility Functions", () => {

    test("should generate a numeric id", () => {

        const id = generateRandomId();

        expect(typeof id).toBe("number");

        expect(Number.isInteger(id)).toBe(true);

    });

    test("should format a task name", () => {

        expect(

            formatTaskName("   hOMEWORK   ")

        ).toBe("Homework");

    });

    test("formatTaskName should throw for a non-string argument", () => {

        expect(() => formatTaskName(42)).toThrow(TypeError);

    });

    test("should identify high priority task", () => {

        const task = {

            priority: 5

        };

        expect(

            isHighPriority(task)

        ).toBe(true);

    });

    test("isHighPriority should return false for null/undefined without throwing", () => {

        expect(isHighPriority(null)).toBe(false);
        expect(isHighPriority(undefined)).toBe(false);

    });

    test("should recursively count an array", () => {

        expect(

            recursiveCount([1, 2, 3, 4])

        ).toBe(4);

    });

    test("should return formatted task names", () => {

        const tasks = [

            {
                title: "homework"
            },

            {
                title: "shopping"
            }

        ];

        expect(

            getFormattedTaskNames(tasks)

        ).toEqual([

            "Homework",

            "Shopping"

        ]);

    });

    test("should return completed tasks", () => {

        const tasks = [

            {
                completed: true
            },

            {
                completed: false
            },

            {
                completed: true
            }

        ];

        expect(

            getCompletedTasks(tasks)

        ).toHaveLength(2);

    });

    test("should calculate total priority", () => {

        const tasks = [

            { priority: 2 },

            { priority: 3 },

            { priority: 5 }

        ];

        expect(

            calculateTotalPriority(tasks)

        ).toBe(10);

    });

    test("priorities should contain three values", () => {

        expect(priorities).toEqual([

            "low",

            "medium",

            "high"

        ]);

    });

});
