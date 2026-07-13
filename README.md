# Task Management Application

## Overview

A modern JavaScript task management app demonstrating OOP, DOM manipulation, event handling, recursion, functional programming, Local Storage, JSON processing, and Jest unit testing.

---

## Features

- Create new tasks
- Assign task priorities
- View all tasks
- Update task priorities
- Mark tasks as completed
- Delete tasks
- Automatically save tasks using Local Storage
- Automatically load saved tasks
- Responsive user interface
- Input validation
- Unit testing with Jest

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6 Modules)
- Local Storage API
- Jest

---

## JavaScript Concepts Demonstrated

- **OOP:** classes, constructors, inheritance, encapsulation
- **ES6+:** let/const, arrow functions, template literals, destructuring, spread/rest, modules, default parameters
- **Functional:** map(), filter(), reduce()
- **Algorithms:** recursion, searching, array manipulation
- **Browser APIs:** DOM manipulation, event listeners, Local Storage, JSON

---

## Project Structure

```
project-folder/

│── index.html
│── styles.css
│── app.js
│── dom.js
│── utils.js
│── app.test.js
│── package.json
│── README.md
```

---

## Installation & Running

```bash
git clone <repository-url>
cd task-manager
npm install
```

Open `index.html` with Live Server (or any local server) to run the app.

---

## Running Tests

```bash
npm test              # run all tests
npm run test:watch    # watch mode
npm run coverage      # coverage report
```

---

## Key Functions

- **app.js:** `Task`, `SubTask`, `addTask()`, `findTaskByTitle()`, `updateTaskPriority()`, `mergeTasks()`, `countCompletedTasks()`, `calculateAveragePriority()`
- **utils.js:** `saveToStorage()`, `loadFromStorage()`, `generateRandomId()`, `formatTaskName()`, `recursiveCount()`
- **dom.js:** `setupEventListeners()`, `handleAddTask()`, `displayTasks()`, `handleTaskClick()`, `updateStatistics()`

---

## Testing

Covers task creation, SubTask inheritance, searching, priority updates, recursion, functional programming, error handling, and utility functions.

---

## Errors Found

The starter code contained 52+ intentional errors across four files:

**Variables & Operators:** implicit global `taskList`, `var` instead of `let`/`const`, `==` instead of `===`, an assignment (`=`) used inside an `if` condition, no `typeof` validation.

**Control Flow:** off-by-one loop in `displayAllTasks`, infinite `while` loop (missing `i++`) in `findTaskByTitle`, imperative loops used where `for...of`/array methods fit better.

**Functions & OOP:** `findTaskByTitle` missing its `title` parameter, recursive `countCompletedTasks` with no base case, `Task` class missing `id` and `toggleCompletion`, `SubTask` missing `super()`, `TaskManager` missing functional methods.

**Modern JavaScript:** no destructuring, string concatenation instead of template literals, no spread/rest operators, no ES6 modules.

**DOM & Events:** `setupEventListeners` called but undefined, broken selectors, no null checks, no event delegation, script running before `DOMContentLoaded`, `localStorage` used without `JSON.stringify`/`parse`.

**Testing:** only 2 incomplete tests, no `beforeEach`, no edge cases.

## Fixes Implemented

Every error above was corrected: consistent `let`/`const`, strict equality throughout, a base case and null checks on recursion, `super()` and `toggleCompletion()` added, destructuring/template literals/spread-rest implemented, real ES6 `import`/`export` across all files, `DOMContentLoaded` initialization with null-checked selectors and event delegation, JSON-based `localStorage` save/load, and a live statistics display. The Jest suite grew from 2 to 25 tests, covering classes, inheritance, recursion, array operations, and error handling, with `beforeEach` resetting state.

## Test Results

Running `npm test` produces **25 passing tests, 0 failures**, including edge cases (empty title, out-of-range priority, missing task ID). See `screenshots/tests-passing.png`.

## Reflection

The trickiest bug wasn't in the starter list: after adding `localStorage` persistence, deleting a task and reloading the page could hand a **duplicate ID** to the next new task, because `taskCounter` reset to 0 on reload while restored tasks kept their original (non-sequential) IDs. I traced it by logging IDs before/after a simulated delete-then-reload cycle, then fixed it by syncing `taskCounter` to the highest restored ID right after loading from storage.

---

## Future Improvements

Due dates, categories, search, drag-and-drop ordering, dark mode, editing, sorting/filtering, cloud sync.

---

## Author

Created as part of a JavaScript learning project demonstrating modern web development and software engineering best practices.