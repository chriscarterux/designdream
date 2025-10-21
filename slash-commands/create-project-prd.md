# Rule: Generating a Product/Project PRD (Epic Level)

## Goal

To guide an AI assistant in creating a comprehensive Product Requirements Document (PRD) at the Epic/Project level in Markdown format. This PRD serves as the foundational document that defines the product vision, goals, and high-level feature roadmap. It aligns with Linear's Epic/Initiative structure.

## Process

1.  **Receive Initial Prompt:** The user provides a product idea, vision, or high-level description of what they want to build.
2.  **Ask Clarifying Questions:** Before writing the PRD, the AI *must* ask clarifying questions to understand the product vision, target market, and strategic goals. Provide options in letter/number lists for easy responses.
3.  **Generate Project PRD:** Based on the initial prompt and user's answers, generate a comprehensive Epic-level PRD using the structure outlined below.
4.  **Save PRD:** Save the generated document as `project-prd.md` in the project root directory.

## Clarifying Questions (Examples)

The AI should adapt its questions based on the prompt, but here are key areas to explore:

*   **Product Vision:** "What is the overarching vision for this product? What change do you want to see in the world?"
*   **Problem Statement:** "What major problem(s) does this product solve? Who experiences this problem?"
*   **Target Market:** "Who are your primary target users? Can you describe their demographics, behaviors, and pain points?"
*   **Value Proposition:** "What unique value does your product provide? Why would users choose this over alternatives?"
*   **Success Criteria:** "How will you measure if this product is successful? What are the key metrics?"
*   **Feature Priorities:** "What are the must-have features for the initial release? What can wait for later?"
*   **Technical Constraints:** "Are there any technical constraints, existing systems to integrate with, or preferred tech stack?"
*   **Timeline & Scope:** "What is the target timeline? Are there any hard deadlines or milestones?"
*   **Competitive Landscape:** "Who are the main competitors? What do they do well/poorly?"

## PRD Structure

The generated Project PRD should include the following sections:

### 1. Product Overview
*   **Product Name:** Clear, memorable name
*   **Tagline:** One-sentence description
*   **Vision Statement:** 2-3 sentences describing the long-term vision
*   **Problem Statement:** What problem are we solving and for whom?

### 2. Goals & Success Metrics
*   **Primary Goals:** 3-5 high-level objectives (e.g., "Enable creators to monetize content")
*   **Success Metrics:** Measurable KPIs (e.g., "10,000 active users in 6 months", "80% user retention")
*   **North Star Metric:** The one metric that matters most

### 3. Target Users
*   **Primary User Persona(s):** Name, role, demographics, behaviors, pain points, goals
*   **Secondary Users:** Other stakeholders or user types
*   **User Journey:** High-level journey from discovery to value realization

### 4. Value Proposition
*   **Unique Value:** What makes this product different/better?
*   **Key Benefits:** Top 3-5 benefits for users
*   **Competitive Advantages:** Why users will choose this product

### 5. Feature Roadmap
*   **MVP (Phase 1):** Core features for initial launch
*   **Phase 2:** Features for the next iteration
*   **Phase 3:** Long-term feature vision
*   **Non-Goals:** What we explicitly will NOT build (to manage scope)

### 6. Technical Architecture (High-Level)
*   **Tech Stack:** Preferred technologies and frameworks
*   **System Architecture:** High-level architecture diagram or description
*   **Integration Points:** External services, APIs, databases
*   **Scalability Considerations:** How will this scale?
*   **Security Requirements:** Key security considerations

### 7. Design Principles
*   **UX Principles:** Core design philosophies (e.g., "mobile-first", "accessibility")
*   **Brand Guidelines:** Visual style, tone of voice
*   **User Experience Goals:** What should using the product feel like?

### 8. Constraints & Dependencies
*   **Technical Constraints:** Limitations, legacy system dependencies
*   **Resource Constraints:** Budget, timeline, team size
*   **External Dependencies:** Third-party services, regulations, partnerships

### 9. Risks & Mitigation
*   **Technical Risks:** What could go wrong technically?
*   **Market Risks:** What could prevent market adoption?
*   **Mitigation Strategies:** How will we address each risk?

### 10. Open Questions
*   List remaining questions or areas needing research/clarification

## Target Audience

This PRD is written for:
*   **Product Team:** To align on vision and strategy
*   **Engineering Team:** To understand technical scope and constraints
*   **Stakeholders:** To communicate progress and get buy-in
*   **Future Team Members:** To onboard quickly and understand context

## Output

*   **Format:** Markdown (`.md`)
*   **Location:** Project root directory
*   **Filename:** `project-prd.md`

## Final Instructions

1. Do NOT start creating feature PRDs or implementing anything yet
2. Make sure to ask comprehensive clarifying questions
3. Use the user's answers to create a thorough, strategic-level PRD
4. Focus on the "why" and "what" at a high level, not the detailed "how"
5. Think like a product manager defining an Epic/Initiative
6. After completing the PRD, suggest: "Next, you can create feature PRDs using `/create-feature-issue` for specific features mentioned in this roadmap."
