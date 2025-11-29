# AGENTS.md - Trivule Project Guidelines

## Build/Lint/Test Commands

- **Build**: `npm run build` (TypeScript compilation + Vite build)
- **Lint**: `npm run lint` (ESLint with TypeScript support)
- **Format**: `npm run format` (Prettier formatting)
- **Test all**: `npm test` (Vitest run)
- **Test watch**: `npm run test-watch` (Vitest watch mode)
- **Single test**: `vitest run <path/to/test-file>` (e.g., `vitest run tests/input.test.ts`)

## Form Validation Behavior

- **No Auto-Validation**: Forms do not validate automatically on page render or binding
- **Event-Driven Validation**: Validation only runs when specified trigger events occur
- **Trigger Events**: Configurable via `triggerEvents?: ('input' | 'blur' | 'submit')[]` (default: `['blur', 'submit']`)
- **Per-Input Blur**: Blur events trigger validation only for the specific input that lost focus
- **Form State Tracking**: Use `form.isDirty`, `form.validated`, and `form.formState` for state management

## API Changes (Major Streamlining Refactor)

### TrivuleForm Class

- **Simplified**: Form state reduced to basic `isDirty`, `validated`, and `formState` properties
- **Removed**: Complex form state arrays (`errors`, `validInputs`, `invalidInputs`)
- **Removed**: Lifecycle hooks (`beforeBinding()`, `afterBinding()`, `_addLifeCycleCallback()`, `_executeLifeCycleCallbacks()`)
- **Removed**: Event emission methods (`onInit()`, `onUpdate()`, `onPasses()`, `onFails()`)
- **Removed**: Real-time methods (`enableRealTime()`, `disableRealTime()`, `isRealTimeEnabled()`)
- **Removed**: `destroy()` method
- **Removed**: Detailed state tracking methods (`_runValidation()`, `_updateFormState()`)
- **Kept**: Basic validation methods (`isValid()`, `passes()`, `inputs()`, `getValidatedInputs()`)
- **Kept**: Form binding and input management functionality

### TrivuleInput Class

- **Simplified**: Event handling reduced to basic trigger events only
- **Removed**: Lifecycle hooks (`beforeInit()`, `afterInit()`, `onRuleFail()`, `onRulePass()`)
- **Removed**: Complex event emission (`onPasses()`, `onFails()`, `onUpdate()`, `emitChangeEvent()`)
- **Removed**: Real-time validation methods (`enableRealTime()`, `disableRealTime()`, `isRealTimeEnabled()`)
- **Removed**: Event management properties (`events`, `setEventTriggers()`, `_setEvent()`)
- **Removed**: `destroy()` method and related cleanup
- **Removed**: `emitOnValidate` and `triggerValidateEvent()` methods
- **Kept**: Core validation methods (`validate()`, `valid()`, `passes()`, `fails()`)
- **Kept**: Rule management (`setRules()`, `getRules()`, `hasRules()`)
- **Kept**: Basic input element access (`getInputElement()`)

## Code Style Guidelines

- **Language**: TypeScript with strict mode enabled
- **Imports**: Use relative imports (`../` for parent dirs), group by external/internal
- **Naming**: PascalCase for classes (TrivuleInput), camelCase for methods/properties
- **Formatting**: Prettier with semicolons, single quotes, trailing commas
- **Types**: Strict typing required, use interfaces for complex objects
- **Error Handling**: Use TypeScript's strict null checks, avoid `any` type
- **Comments**: JSDoc for public APIs, minimal inline comments
- **Commits**: Conventional commits (feat/fix/docs/style/refactor/test/chore/perf/ci/build/revert)</content>
  <parameter name="filePath">/home/devalade/Code/JSBenin/Trivule/trivule/AGENTS.md
