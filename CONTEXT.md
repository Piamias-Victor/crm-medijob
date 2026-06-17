# CONTEXT.md — crm-medijob

> Domain glossary and bounded-context map for the CRM MediJob project.
> Kept up to date by `/grill-with-docs`. Don't edit manually — run that skill instead.

## Project summary

crm-medijob is a CRM platform tailored to the medical staffing industry. It allows staffing agencies to manage candidates, clients (hospitals / clinics), job orders, placements, and the full recruitment pipeline.

## Glossary

<!-- Terms will be added here by /grill-with-docs as the domain is explored. -->

| Term | Definition | Avoid |
| ---- | ---------- | ----- |
| Candidate | A healthcare professional seeking placement | "applicant", "user" |
| Client | A healthcare facility that posts job orders | "employer", "customer" |
| Job Order | A request from a Client for one or more Candidates | "job", "listing" |
| Placement | A confirmed assignment of a Candidate to a Job Order | "hire", "contract" |

## Bounded contexts

- **Pipeline** — manages the lifecycle of a Candidate through a Job Order (from application to Placement)
- **CRM** — contacts, activities, notes, and follow-ups linked to Candidates and Clients
- **Auth** — authentication and role-based access (NextAuth v5)

## Architectural decisions

See `docs/adr/` for all ADRs.
