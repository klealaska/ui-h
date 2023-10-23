# Data Governance Requirements[](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist?anchor=data-governance-requirements)

_Owner:_ Data Governance Team - [DataGov@avidxchange.com](mailto:DataGov@avidxchange.com)

_Purpose:_ The Data Governance requirements ensure that users and processes serviced by various application(s) get the right data, information and intelligence through proper ownership, operations, tools, controls and artifacts resulting in adequate data quality, security, privacy and availability. This is key to reducing financial, operational, reputational and regulatory risks and ensuring business continuity. Data Governance also continuously improves data maturity, data monetization and analytical capabilities.

_How To:_ In order to complete the following Data Governance requirements, [submit this Service Now Request](https://avidxchange.service-now.com/sp?id=sc_cat_item&sys_id=f32bd52b1b5fb0503921edf5624bcb00) .

Please include the following details:

1.  Does the application produce data or intelligence used in operations? If yes, list the operational processes and/or systems that data from this application is used.
2.  Does the application create, use, process Master Data (Data that is critical for day-to-day business operations)?
3.  Does the application use, process or store data that could compromise privacy and/or security of employees, clients, vendors, or partners (PII, NPI, credentials, etc.)? If so, list these data elements and the need to use this information.
4.  Does the application use data or part of processes that have a regulatory impact or used in external reporting to regulatory agencies or stockholders? If so, list the external entities that this application caters to and the data/reports that are created.
5.  Provide the following details to generate the data catalog and lineage if the database or store doesn’t already have a data catalog
    - Domain Name
    - Database Type
    - Preferred Environment to Scan
    - Server Name
    - Port
    - Database
    - Preferred time to run Meta-scan (Ex. Before 7am, after 7pm, anytime)
6.  List of controls/procedures to ensure data quality and other relevant artifacts (link wiki for C4 Architecture Diagrams)

The Data Governance Team has a 3 week SLA for approvals. If you are unsure of how to adhere to the Data Governance requirements and need assistance or guidance, please engage with them sooner than the 3 week SLA.

| ID       | Criteria                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Required for Dark Launch | Required for Live Launch |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | ------------------------ |
| LRR-DG-1 | All critical applications SHOULD ensure that following documentation exists: 1. Possible data availability, quality and security compromise scenarios and appropriate remediation procedures/measures are documented 2. SLAs for data quality and availability are defined, agreed, and maintained with upstream and downstream systems/providers 3. Point of contacts and at least one back up personnel for upstream data providers and downstream consumers is maintained 4. All manual processes that operate on data should have quality controls that check the validity of the data before it is consumed by downstream systems/processes | No                       | No                       |
| LRR-DG-2 | All applications that create, use, modify Key Business Elements (KBE) SHOULD: 1. Identify and document a catalog of the KBE. 2. Ensure access of KBEs to personnel and applications that require it for business needs and deny access to all others. 3. Ensure procedures to log access to elements                                                                                                                                                                                                                                                                                                                                             | No                       | No                       |
| LRR-DG-3 | All applications that are under regulatory purview or that cater to external entities SHOULD have controls in place to ensure data is stored, processed, retained and consumed according to regulatory or external SLAs.                                                                                                                                                                                                                                                                                                                                                                                                                         | No                       | No                       |
| LRR-DG-4 | Applications and teams SHOULD ensure that NPI, PII and other sensitive data are treated with the appropriate security at rest, transit and destination using access controls, encryption, redaction or other means.                                                                                                                                                                                                                                                                                                                                                                                                                              | No                       | No                       |
| LRR-DG-5 | Application team SHOULD produce Table Definitions and field level definitions where appropriate and include in the Enterprise Data Catalog either directly in the information schema or via template upload via the Data Governance Team. Example (must be on VPN to access)                                                                                                                                                                                                                                                                                                                                                                     | No                       | No                       |