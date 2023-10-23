**Latest Version of LRR:** https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist

**Release Notes** https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/21189/Release-Notes

### Current Verison of the Launch Readiness Checklist is v3.1.[](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist?anchor=current-verison-of-the-launch-readiness-checklist-is-v3.1.)

This page describes the Launch Readiness Review checklist for the NextGen Path to Production (P2P) process.

Use the [template](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/30462/Launch-Readiness-Review-v3.1-Template) to make a copy of the checklist into your service's repository and populate links or explanation of how all requirements are accomplished. This will be a living document and the team will walk through it during the Launch Readiness Review.

Contents

- [Current Verison of the Launch Readiness Checklist is v3.1.](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist#current-verison-of-the-launch-readiness-checklist-is-v3.1.)

- [Definitions](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist#definitions)
- [LRR Core Requirements](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist#lrr-core-requirements)
- [Access Requirements](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist#access-requirements)
- [Architecture and Design](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist#architecture-and-design)
- [Operational Support Readiness & Incident Management](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist#operational-support-readiness-%26-incident-management)
- [Branching](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist#branching)
- [Pipeline](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist#pipeline)
- [Monitoring & Observability](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist#monitoring-%26-observability)
- [Disaster Recovery Requirements](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist#disaster-recovery-requirements)
- [Data Governance Requirements](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist#data-governance-requirements)

# Definitions[](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist?anchor=definitions)

- **Dark Launch** is defined as deploying changes to the production environment but intentionally making these changes opaque to the customers or users.
- **Live Launch** is defined as deploying changes to the production environment that have an impact on the customer experience.
- **MUST** requirements indicate that the Launch Readiness Review requirement is mandatory and must be met in order to be approved in a Launch Readiness Review.
- **SHOULD** requirements indicate that the Launch Readiness Review requirement is recommended but not mandatory and does not have to be met in order to be approved in a Launch Readiness Review.

