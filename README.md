# Task Management Application

## Overview

The Task Management Application is a modern JavaScript application that allows users to create, manage, update, and organize tasks through an interactive web interface.

The project demonstrates modern JavaScript (ES6+) concepts including object-oriented programming, DOM manipulation, event handling, recursion, functional programming, local storage, JSON processing, and unit testing using Jest.

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

### Object-Oriented Programming

- Classes
- Constructors
- Inheritance
- Encapsulation

### ES6 Features

- let and const
- Arrow functions
- Template literals
- Destructuring
- Spread operator
- Modules
- Default parameters

### Functional Programming

- map()
- filter()
- reduce()

### Algorithms

- Recursion
- Searching
- Array manipulation

### Browser APIs

- DOM Manipulation
- Event Listeners
- Local Storage
- JSON

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

## Installation

Clone the repository.

```bash
git clone <repository-url>
```

Navigate into the project.

```bash
cd task-manager
```

Install dependencies.

```bash
npm install
```

---

## Running the Project

Open the project in your preferred editor.

If using VS Code:

Install the Live Server extension.

Run:

```bash
Open index.html with Live Server
```

---

## Running Tests

Run all tests.

```bash
npm test
```

Run tests in watch mode.

```bash
npm run test:watch
```

Generate a coverage report.

```bash
npm run coverage
```

---

## Key Functions

### app.js

- Task class
- SubTask class
- addTask()
- displayAllTasks()
- findTaskByTitle()
- updateTaskPriority()
- mergeTasks()
- countCompletedTasks()
- calculateAveragePriority()

### utils.js

- saveToStorage()
- loadFromStorage()
- generateRandomId()
- formatTaskName()
- recursiveCount()

### dom.js

- setupEventListeners()
- handleAddTask()
- displayTasks()
- handleTaskClick()

---

## Testing

The project includes automated tests covering:

- Task creation
- SubTask inheritance
- Task searching
- Priority updates
- Recursive functions
- Functional programming
- Error handling
- Utility functions

---

## Future Improvements

Possible future enhancements include:

- Task due dates
- Categories
- Search functionality
- Drag-and-drop task ordering
- Dark mode
- Task editing
- Sorting and filtering
- Cloud synchronization

---

## Author

Created as part of a JavaScript learning project demonstrating modern web development concepts and software engineering best practices.