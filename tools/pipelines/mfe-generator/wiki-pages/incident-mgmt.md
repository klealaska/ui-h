
# Operational Support Readiness & Incident Management[](https://dev.azure.com/avidxchange/technology-references/_wiki/wikis/tech-refs/7993/Launch-Readiness-Review-Checklist?anchor=operational-support-readiness-%26-incident-management)

_Owner:_ ITSM

_Purpose:_ The Incident Management requirements ensure that the ITSM processes are followed since the makeup and role of teams in NextGen is different from what Avid is used to.

_How To:_ In order to meet the following Incident Management requirements, the team must schedule a meeting with [tsmirt@avidxchange.com](mailto:tsmirt@avidxchange.com) to review that you have met the requirements, prior to a Launch Readiness Review. Use the spreadsheet here to complete the requirements for [ITSM](https://avidxchange.sharepoint.com/:x:/r/sites/TechCritCom/_layouts/15/Doc.aspx?sourcedoc=%7BC148421A-A8ED-4EDD-AEF8-81D4BCBA43FB%7D&file=Onboarding%20new%20support%20teams%20to%20ITSM%20Processes.xlsx&action=default&mobileredirect=true&cid=b19ee01a-b7c5-48d8-828e-df6d073cc60a) . Review the [ITSM Onboarding Process Guide](https://avidxchange.sharepoint.com/:w:/r/sites/TechCritCom/_layouts/15/Doc.aspx?sourcedoc=%7B78CA4E79-D986-4AF0-A445-8600EF2CEDB0%7D&file=ITSM%20Activities%20-%20Launch%20Readiness%20Review%20%28LRR%29%20process%20guide.docx&action=default&mobileredirect=true) prior to your meeting with the ITSM team.

| ID            | Criteria                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Required for Dark Launch | Required for Live Launch | Team Documentation                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------ | ----------------------------------------------------------------------------- |
| LRR-IncMgmt-1 | Application team MUST have a [Business Service](https://avidxchange.service-now.com/com.glideapp.servicecatalog_cat_item_view.do?v=1&sysparm_id=1b851433dbec7600094bf209af96196f&sysparm_link_parent=3741c4a2dbbf5200bbcbf2b6af961916&sysparm_catalog=e0d08b13c3330100c8b837659bba8fb4&sysparm_catalog_view=catalog_default&sysparm_view=text_search) and any necessary [Configuration Items (CIs)](https://avidxchange.service-now.com/nav_to.do?uri=%2Fcom.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D1f8cdc7ddb4393007f3dec51ca9619b8%26sysparm_link_parent%3D3741c4a2dbbf5200bbcbf2b6af961916%26sysparm_catalog%3De0d08b13c3330100c8b837659bba8fb4%26sysparm_catalog_view%3Dcatalog_default%26sysparm_view%3Dtext_search) created and up to date in Service Now.                                   | Yes                      | Yes                      | Business Service: "${businessService}" Assignment Group: "${assignmentGroup}" |
| LRR-IncMgmt-2 | Application team MUST have an [Assignment Group created](https://avidxchange.service-now.com/nav_to.do?uri=%2Fcom.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D419ae053db4668504085d206ca9619e6%26sysparm_link_parent%3D3741c4a2dbbf5200bbcbf2b6af961916%26sysparm_catalog%3De0d08b13c3330100c8b837659bba8fb4%26sysparm_catalog_view%3Dcatalog_default%26sysparm_view%3Dcatalog_default) and [updated with the appropriate teammates](https://avidxchange.service-now.com/com.glideapp.servicecatalog_cat_item_view.do?v=1&sysparm_id=d57bd29d0fbede00690cf08ce1050e4d&sysparm_link_parent=ac3e3692dbfb5200bbcbf2b6af9619dc&sysparm_catalog=e0d08b13c3330100c8b837659bba8fb4&sysparm_catalog_view=catalog_default&sysparm_view=text_search) . There should be a group manager, as well as the teammates. | Yes                      | Yes                      | Assignment Group: "${assignmentGroup}"                                        |
| LRR-IncMgmt-3 | Application team MUST define what qualifies as an incident as well as the criteria for prioritization (P1-P4). Please see the Major Incident Management priority [guidelines](https://avidxchange.sharepoint.com/:p:/r/sites/TechCritCom/_layouts/15/Doc.aspx?sourcedoc=%7B591F994D-7442-45FC-A695-C209B178429F%7D&file=Impact_Urgency_PriorityV2.pptx&action=edit&mobileredirect=true) for incident prioritization.                                                                                                                                                                                                                                                                                                                                                                                                        | No                       | Yes                      | Yes                                                       |
| LRR-IncMgmt-4 | Application team MUST document and review their process for handling issues of all priority with the LRR team. Include alerting mechanisms, response plans, stakeholders to communicate with, responsible teammates, and escalation paths.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | No                       | Yes                      | Yes                                                      |
| LRR-IncMgmt-5 | Application team MUST understand any restrictions on their offering with respect to planned outages (mastercard agreement, potentially other partners in the future).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | No                       | Yes                      | Application will have no planned outages.                                     |
| LRR-IncMgmt-6 | Application team SHOULD request Pager Duty licenses and set up a Pager Duty escalation path. During your conversation with the ITSM team they will help make the determination about if Pager Duty access is required. Pager Duty access is only necessary if your service is customer facing, has automated alerting configured, and automated incident creation configured.                                                                                                                                                                                                                                                                                                                                                                                                                                               | No                       | Yes                      | TODO


<br><br>
## LRR-IncMgmt-3

P1

- UI presentation layer does not load

- BFF layer is non-responsive, resulting in no data being loaded

- Any issue, such as a CORS error, causes some application code to not load, rendering application non-functional for all users

- Over 20% of customers are being impacted by an identified defect with no workaround

- Any loss of revenue or unexpected cost to a customer

- Loss to AvidXchange of $1,000 or greater

- Any content, feature, or public-facing material that would harm the reputation of AvidXchange

P2

- Over 20% of customers are being impacted by an identified defect with a workaround

P3

- Between 10% - 20% of users are being impacted by an identified defect with workarounds

P4

- Less than 10% of users are being impacted by an identified defect with workarounds

##LRR-IncMgmt-4

- P1 warrants immediate notification and communication with executives and stakeholders

- P2 warrants immediate notification of support team (${assignmentGroup}) and product owners

- P3 warrants notification of support team (${assignmentGroup}) and product owners

- P4 warrants notification of support team (${assignmentGroup})

Site Loading

| Problem                   | Impact                              | Workaround | Priority | Possible Causes                                    |
| ------------------------- | ----------------------------------- | ---------- | -------- | -------------------------------------------------- |
| Application does not load | Appllication is unavailable for use | None       | P1       | Azure outage, Deleted files, Routing configuration |

Data Display / Management

| Problem                                                      | Impact                              | Workaround | Priority | Possible Causes                                                                         |
| ------------------------------------------------------------ | ----------------------------------- | ---------- | -------- | --------------------------------------------------------------------------------------- |
| No response from BFF                                         | Appllication is unavailable for use | None       | P1       | Azure outage, Misconfiguration of Azure resource                                        |
| Application does not display Tenant data / response from BFF | Appllication is unavailable for use | None       | P1       | Tenant platform service non-responsive. Issue should include that team for remediation. |
| Data does not save                                           | Appllication is unavailable for use | None       | P1       | Tenant platform service non-responsive. Issue should include that team for remediation. |
