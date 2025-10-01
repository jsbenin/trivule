---

name: "Bug report"
description: "Report a bug to help us improve Trivule"
labels: ["bug"]
body:

- type: markdown
  attributes:
  value: |
  Thanks for taking the time to file a bug report! Please provide as much detail as possible.

- type: textarea
  id: description
  attributes:
  label: "Describe the bug"
  description: "A clear and concise description of what the bug is."
  placeholder: "Tell us what you did to trigger the bug..."
  value: "A bug happened!"
  validations:
  required: true

- type: textarea
  id: expected
  attributes:
  label: "Expected behavior"
  description: "A clear and concise description of what you expected to happen."
  validations:
  required: true

- type: textarea
  id: actual
  attributes:
  label: "Actual behavior"
  description: "A clear and concise description of what actually happened."
  validations:
  required: true

- type: textarea
  id: steps
  attributes:
  label: "Steps to reproduce"
  description: "Steps to reproduce the behavior."
  placeholder: | 1. Go to '...' 2. Click on '....' 3. Scroll down to '....' 4. See error
  validations:
  required: true

- type: textarea
  id: environment
  attributes:
  label: "Environment"
  description: "Tell us about your environment."
  placeholder: | - OS: [e.g. macOS, Windows, Linux] - Browser: [e.g. Chrome, Safari] - Version: [e.g. 22]

- type: textarea
  id: additional
  attributes:
  label: "Additional context"
  description: "Add any other context about the problem here."
