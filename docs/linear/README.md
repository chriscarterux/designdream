# Linear Integration Documentation

This documentation covers the complete setup and workflow for integrating Design Dream with Linear for client project management.

## Overview

Design Dream uses Linear for project management with an AI-powered task analysis system. When clients create issues in Linear, our system automatically:

1. Receives webhook notifications
2. Fetches complete issue details
3. Analyzes task complexity using Claude AI
4. Posts analysis back as Linear comments
5. Tracks SLA compliance

## Workflow States

Linear projects use a standard 5-state kanban workflow:

```
Backlog → Todo → In Progress → In Review → Done
```

### State Definitions

- **Backlog**: Unrefined tasks that need scoping
- **Todo**: Ready to start, well-defined tasks
- **In Progress**: Actively being worked on
- **In Review**: Completed, awaiting review
- **Done**: Completed and approved

## AI-Powered Task Analysis

When a client creates a new issue, Design Dream's AI automatically analyzes it and posts a comment with:

- **Complexity Classification**: SIMPLE (≤4 hours) or COMPLEX (>4 hours)
- **Estimated Hours**: Time estimate based on scope
- **Reasoning**: Why the task is classified this way
- **Suggested Action**: Next steps for the task
- **Suggested Breakdown**: For complex tasks, subtasks to break it down

## Documentation Structure

1. [**Account Setup**](./01-account-setup.md) - Create Linear workspace and configure API access
2. [**Project Template**](./02-project-template.md) - Set up project structure and workflow
3. [**Testing Guide**](./03-testing-guide.md) - Test webhook integration and AI analysis
4. [**API Setup**](./04-api-setup.md) - Configure Linear API authentication

## Quick Start

1. Create Linear workspace and generate API key
2. Set up project using the template
3. Configure webhook pointing to your app
4. Test with sample issues
5. Monitor SLA compliance via dashboard

## Benefits

- **Automatic Task Analysis**: AI analyzes every new task
- **SLA Tracking**: Monitor response and completion times
- **Client Transparency**: Clients see analysis and progress
- **Complexity Management**: Break down complex tasks automatically
- **Time Estimation**: Accurate hour estimates for planning
