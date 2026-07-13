import {

    Task,

    SubTask,

    taskList,

    addTask,

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

    resetTaskManager

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

});

describe("Task Functions", () => {

    beforeEach(() => {

        resetTaskManager();

    });

    test("should add a task", () => {

        const task = addTask(
            "New Task",
            "Testing",
            2
        );

        expect(taskList.length).toBe(1);

        expect(task).toBe(taskList[0]);

        expect(task.title).toBe("New Task");

        expect(task.priority).toBe(2);

    });

    test("should find task by title", () => {

        addTask(
            "Homework",
            "Math",
            3
        );

        const task = findTaskByTitle("Homework");

        expect(task).toBeDefined();

        expect(task.title).toBe("Homework");

    });

    test("should return undefined for missing task", () => {

        const task = findTaskByTitle("Unknown");

        expect(task).toBeUndefined();

    });

    test("should update task priority", () => {

        const task = addTask(
            "Assignment",
            "Programming",
            2
        );

        const updated = updateTaskPriority(
            task.id,
            5
        );

        expect(updated).toBe(true);

        expect(task.priority).toBe(5);

    });

    test("should return false for invalid id", () => {

        const updated = updateTaskPriority(
            9999,
            5
        );

        expect(updated).toBe(false);

    });

    test("should calculate average priority", () => {

        addTask(
            "Task 1",
            "Description",
            2
        );

        addTask(
            "Task 2",
            "Description",
            4
        );

        expect(
            calculateAveragePriority()
        ).toBe(3);

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

    test("should count completed tasks recursively", () => {

        const task1 = addTask(
            "Task 1",
            "Description",
            1
        );

        const task2 = addTask(
            "Task 2",
            "Description",
            3
        );

        const task3 = addTask(
            "Task 3",
            "Description",
            5
        );

        task1.toggleCompletion();

        task3.toggleCompletion();

        expect(

            countCompletedTasks(taskList)

        ).toBe(2);

    });

    test("should return high priority tasks", () => {

        addTask(
            "Low",
            "Description",
            1
        );

        const highTask = addTask(
            "High",
            "Description",
            5
        );

        const results = getHighPriorityTasks(3);

        expect(results).toHaveLength(1);

        expect(results[0]).toBe(highTask);

    });

    test("should return empty array when no high priority tasks exist", () => {

        addTask(
            "Task",
            "Description",
            2
        );

        expect(

            getHighPriorityTasks(4)

        ).toEqual([]);

    });

});
describe("Error Handling", () => {

    beforeEach(() => {

        resetTaskManager();

    });

    test("should return null when task title is invalid", () => {

        const result = addTask("", "Description", 3);

        expect(result).toBeNull();

    });

    test("should return null for invalid priority", () => {

        const result = addTask(
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

        addTask("Task 1", "Description", 2);

        const clone = cloneTaskList(taskList);

        expect(clone).toEqual(taskList);
        expect(clone).not.toBe(taskList);

    });

    test("duplicateTaskWithChanges should merge properties using object spread", () => {

        const task = addTask("Task 1", "Description", 2);

        const updated = duplicateTaskWithChanges(task, { priority: 5 });

        expect(updated.title).toBe("Task 1");
        expect(updated.priority).toBe(5);

    });

    test("splitFirstTask should destructure the first task and the rest", () => {

        const task1 = addTask("Task 1", "Description", 1);
        const task2 = addTask("Task 2", "Description", 2);

        const { firstTask, remainingTasks } = splitFirstTask(taskList);

        expect(firstTask).toBe(task1);
        expect(remainingTasks).toEqual([task2]);

    });

    test("getManagerTaskCount should destructure its parameter", () => {

        addTask("Task 1", "Description", 1);
        addTask("Task 2", "Description", 2);

        expect(
            getManagerTaskCount({ tasks: taskList })
        ).toBe(2);

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

    test("should identify high priority task", () => {

        const task = {

            priority: 5

        };

        expect(

            isHighPriority(task)

        ).toBe(true);

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