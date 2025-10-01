---

name: "Feature request"
description: "Suggest an idea for this project"
labels: ["enhancement"]
body:

- type: markdown
  attributes:
  value: |
  Thanks for taking the time to file a feature request! Please describe the new feature or enhancement.

- type: textarea
  id: summary
  attributes:
  label: "Summary"
  description: "A brief summary of the feature request."
  validations:
  required: true

- type: textarea
  id: motivation
  attributes:
  label: "Motivation"
  description: "Why would this feature be useful?"
  validations:
  required: true

- type: textarea
  id: details
  attributes:
  label: "Detailed description"
  description: "Provide more details about the feature, including any specific requirements or examples."
  validations:
  required: true

- type: textarea
  id: alternatives
  attributes:
  label: "Alternatives considered"
  description: "Have you considered any alternative ways to achieve this? If so, please describe them."

- type: textarea
  id: additional
  attributes:
  label: "Additional context"
  description: "Add any other context or screenshots about the feature request here."
