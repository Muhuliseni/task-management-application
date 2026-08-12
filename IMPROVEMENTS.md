# Improvements Made for Resubmission

Original score: **78%**. This document maps every piece of assessor feedback to
the specific change made in response, so it's easy to verify each point was
addressed.

## 1. Variables & Operators — was "Outstanding"
No changes needed; kept as-is (`let`/`const`, strict equality, typeof
validation throughout).

## 2. Control Flow — was "Competent"
> "consider using Array.prototype.find in updateTaskPriority to remove the
> index-based loop"

- `updateTaskPriority` (`app.js`) now uses `tasks.find(...)` instead of a
  `for (let i = 0; i < tasks.length; i++)` loop, while keeping the same
  type/range validation and edge-case handling.

## 3. Functions & Functional Programming — was "Competent"
> "minimize reliance on global state by passing task arrays into functions
> like calculateAveragePriority and getHighPriorityTasks... consider adding a
> small custom higher-order utility"

- `calculateAveragePriority(tasks)`, `getHighPriorityTasks(tasks, minPriority)`,
  `findTaskByTitle(tasks, title)`, and `updateTaskPriority(tasks, ...)` are now
  pure functions that take the task array as a parameter instead of reading a
  module-level `taskList` global.
- Added `createTaskFilter(predicate)`, a higher-order function that returns a
  reusable filter function. `filterCompletedTasks` and `filterPendingTasks`
  are built from it, and `getHighPriorityTasks` is implemented on top of it too.
- Added `pickTaskFields(task, ...fields)`, a second rest-parameter example
  (collecting individual field names rather than arrays, unlike `mergeTasks`).

## 4. OOP & Classes — was "Competent"
> "encapsulate state in a TaskManager class with private fields/getters/setters
> and expose methods instead of relying on global arrays"

- `TaskManager` is now a real class with a private `#tasks` field. All access
  goes through methods (`add`, `remove`, `updatePriority`, `toggleCompletion`,
  `restore`, `reset`, ...) or the read-only `tasks` getter, which returns a
  defensive copy so external code can never mutate the private array directly.
- `Task`'s id counter moved from a mutable module-level `let taskCounter` into
  a `static #idCounter` private field on the `Task` class itself, with
  `Task.resetIdCounter()` / `Task.raiseIdCounterFloor()` as its only entry
  points.

## 5. Modern JavaScript Features — was "Competent"
> "adding optional chaining/nullish coalescing where accessing dataset/DOM
> values and including an additional rest parameter or spread use"

- `dom.js` now uses optional chaining and nullish coalescing throughout:
  `event.target?.closest(...)`, `target.dataset?.id ?? NaN`,
  `titleInput.value?.trim() ?? ""`, `titleInput?.addEventListener(...)`, etc.
- Added `pickTaskFields` (rest parameter over individual arguments) and
  `TaskManager.getSummary()` (object spread over a base stats object), on top
  of the existing spread/rest examples.

## 6. DOM & Event Handling — was "Competent"
> "consider adding another delegated interaction (e.g., inline priority
> updates) and a few more defensive checks around dataset parsing"

- Added an inline priority `<select>` on every task card. Changes are handled
  by a new `handlePriorityChange` function, delegated from the `#task-list`
  container (a `change` listener) exactly like the existing click delegation.
- `handleTaskClick` and `handlePriorityChange` both use `closest()` plus
  optional chaining to resolve the right element defensively, instead of
  assuming `event.target` is exactly the button/select clicked.
- All listener wiring was consolidated into `setupEventListeners()` (it used
  to be split between that function and the `DOMContentLoaded` callback),
  which also makes it independently testable.

## 7. Testing — was "Competent"
> "add DOM/JSDOM tests for rendering and event delegation, include tests for
> negative branches that throw... measure coverage"

- New `dom.test.js` (jsdom environment) covers `displayTasks` rendering (empty
  state and populated), `updateStatistics`, delegated click handling
  (complete/delete), delegated change handling (priority select), a real
  bubbled-event integration test through `setupEventListeners`, form
  submission via `handleAddTask`, validation/alert paths, `clearTaskForm`, and
  `loadTasks` restoring from storage.
- `app.test.js` gained throwing-branch tests for every validating function
  (`Task`, `SubTask`, `updateTaskPriority`, `getTaskDetails`, `mergeTasks`,
  `cloneTaskList`, `duplicateTaskWithChanges`, `splitFirstTask`,
  `getManagerTaskCount`, `pickTaskFields`, `createTaskFilter`, and its
  returned filter function), plus coverage for `TaskManager`'s new methods
  (`restore`, `getSummary`, encapsulation of `#tasks` via the `tasks` getter).
- `package.json` now sets Jest `coverageThreshold`s (85% lines/statements,
  80% branches) so a regression in coverage fails CI instead of going unnoticed.

## 8. Error Handling & Code Quality — was "Competent"
> "add JSDoc for all functions, centralize error messages/constants, and
> consider adopting ESLint/Prettier"

- New `constants.js` centralizes every validation limit (`PRIORITY_MIN`,
  `PRIORITY_MAX`) and error message (`ERROR_MESSAGES`) used across `app.js`
  and `utils.js`, so wording only needs to change in one place.
- Every function, class, and method across `app.js`, `utils.js`, and `dom.js`
  now has a JSDoc block, including `@throws` tags for functions that validate
  their input.
- Added `eslint.config.js` and `.prettierrc.json`, plus `npm run lint` and
  `npm run format` scripts.

## Other notes for the reviewer
- `resetTaskManager()` and the exported `taskManager` singleton replace the
  old exported `taskList`/`taskCounter` globals; `dom.js` and the tests were
  updated to use `taskManager` throughout.
- Run `npm install` after pulling this branch — `jest-environment-jsdom`,
  `eslint`, and `prettier` were added as devDependencies.
