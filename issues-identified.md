# Issues Identified — Task Management Application

## Variables & Operators
- Global `taskList` was declared without `var`/`let`/`const`, creating an implicit global.
- `taskCounter` used `var` instead of `let`/`const`, causing scoping issues.
- Loose equality (`==`) used instead of `===` in `findTaskByTitle` and `isHighPriority`.
- Assignment operator (`=`) used instead of comparison (`===`) inside an `if` in `updateTaskPriority`, silently overwriting task IDs.
- No `typeof` validation on function parameters throughout `app.js`.

## Control Flow
- Off-by-one error in `displayAllTasks` (`i <= taskList.length`), causing an out-of-bounds access.
- Infinite loop in `findTaskByTitle` due to a missing `i++` in the `while` loop.
- Imperative `for` loops used in places better suited to `for...of` or array methods (`getHighPriorityTasks`, `mergeTasks`).

## Functions & OOP
- `findTaskByTitle` was missing its `title` parameter entirely.
- `countCompletedTasks` (recursive) had no base case, causing stack overflow / index-out-of-bounds errors.
- `Task` class was missing an `id` property and a `toggleCompletion` method.
- `SubTask` class was missing its `super()` call, so inherited properties were never initialized.
- `TaskManager` object was missing functional methods (`getCompletedTasks`, `getPendingTasks`, `getTaskTitles`, `getTotalPriority`).

## Modern JavaScript
- No destructuring anywhere (`getTaskDetails` manually reassigned each property).
- String concatenation used instead of template literals (`getInfo`, DOM rendering).
- No spread operator (`mergeTasks` manually looped instead of `[...list1, ...list2]`).
- No rest parameters and no ES6 module `import`/`export` statements.

## DOM & Events
- `setupEventListeners` was called but never defined, crashing the app on load.
- Selectors mixed ID/class syntax incorrectly (`getElementById(".add-task-btn")`, missing `#` on `querySelector`).
- No null checks before attaching listeners or manipulating elements.
- No event delegation for task complete/delete actions.
- Script initialization ran before `DOMContentLoaded`.
- `saveToStorage`/`loadFromStorage` did not use `JSON.stringify`/`JSON.parse`.

## Testing
- Only 2 tests existed, no `beforeEach`, no edge cases, missing imports.

## Fixes Implemented
All items above were corrected: `let`/`const` throughout, `===` everywhere, base case added to recursion, `super()` added, `toggleCompletion` and `id` added, destructuring/template literals/spread implemented, ES6 modules with proper imports/exports across `app.js`, `dom.js`, and `utils.js`, `setupEventListeners` defined and wired to `DOMContentLoaded`, JSON + localStorage save/load implemented, event delegation added for task actions, and the test suite expanded to 25+ tests covering classes, inheritance, recursion, array operations, and error handling.