# Contributing to Veritas Academy

We welcome and appreciate contributions to the Veritas Academy project! By contributing, you help us unlock the true potential of students worldwide. To ensure a smooth and collaborative development process, please adhere to the following guidelines.

## Brand Guidelines

When contributing to Veritas Academy, please keep the following brand elements in mind:

*   **Brand Name**: Veritas Academy
*   **Tagline**: Unlocking Your True Potential
*   **Brand Colors**:
    *   Navy Blue: `#001F3F`
    *   Gold: `#FFD700`
    *   Light Gray: `#F0F0F0`
    *   White: `#FFFFFF`

## Coding Standards

To maintain a high level of code quality, readability, and consistency across the project, specific coding standards and conventions are enforced:

### General Principles

*   **Clarity and Readability**: Write code that is easy to understand and maintain by others.
*   **Modularity**: Break down complex problems into smaller, manageable components.
*   **Performance**: Optimize code for efficiency and responsiveness.
*   **Security**: Always consider security implications, especially when handling user data or authentication.

### Component Structure

*   All React components are implemented as **functional components** using arrow functions, promoting a modern and concise syntax.

### State Management

*   React Hooks, including `useState`, `useEffect`, and `useContext`, are the primary mechanisms for managing both local and global state within components.

### Naming Conventions

A strict set of naming conventions is followed:

*   **Files**: `PascalCase` is used for component files (e.g., `MyComponent.jsx`), while `kebab-case` is adopted for other file types (e.g., `utility-functions.js`).
*   **Variables and Functions**: `camelCase` is the standard for naming variables and functions.
*   **Constants**: `UPPER_SNAKE_CASE` is reserved for global constants.

### Error Handling

*   Asynchronous operations are consistently wrapped in `try-catch` blocks to gracefully handle errors and provide meaningful feedback to users, improving the overall robustness of the application.

## Git Workflow & Pull Request Guidelines

A structured Git workflow is adopted to facilitate collaborative development, ensure code quality, and manage releases effectively.

### Branching Strategy

*   **`main` branch**: Reserved for production-ready code. All deployments to the live environment originate from this branch.
*   **`dev` branch**: Serves as the primary integration branch for all new features and bug fixes. All feature branches are merged into `dev` before being considered for `main`.
*   **Feature Branches**: New features and significant bug fixes are developed in dedicated `feature/your-feature-name` branches (e.g., `feature/frontend-dashboard-ui`). This isolation prevents direct interference with the `dev` branch.

### Pull Request (PR) Process

1.  **Create a Feature Branch**: Before starting work, create a new branch from `dev`:
    ```bash
    git checkout dev
    git pull origin dev
    git checkout -b feature/your-feature-name
    ```
2.  **Develop and Commit**: Make your changes, adhering to the coding standards. Commit your changes with clear, concise commit messages.
3.  **Test Your Changes**: Ensure your changes are thoroughly tested and do not introduce regressions.
4.  **Push Your Branch**: Push your feature branch to the remote repository:
    ```bash
    git push origin feature/your-feature-name
    ```
5.  **Open a Pull Request**: Open a Pull Request from your feature branch to the `dev` branch. Provide a clear and detailed description of your changes, including:
    *   A summary of the changes.
    *   The problem it solves or the feature it adds.
    *   Any relevant screenshots or GIFs for UI changes.
    *   Testing steps.
6.  **Code Review**: All PRs require at least one review from another AI agent or human developer to ensure code quality and adherence to standards before merging.
7.  **Address Feedback**: Respond to comments and make necessary adjustments based on feedback from reviewers.
8.  **Merge**: Once approved, your PR will be merged into the `dev` branch.

## Reporting Bugs

If you find a bug, please open an issue on the GitHub repository with the following information:

*   A clear and concise description of the bug.
*   Steps to reproduce the behavior.
*   Expected behavior.
*   Screenshots or error messages if applicable.
*   Your environment (browser, OS, etc.).

## Suggesting Enhancements

We welcome suggestions for new features or improvements. Please open an issue on GitHub with:

*   A clear and concise description of the proposed enhancement.
*   The problem it solves or the value it adds.
*   Any potential solutions or ideas.

Thank you for contributing to Veritas Academy! Your efforts help us build a better platform for students.
