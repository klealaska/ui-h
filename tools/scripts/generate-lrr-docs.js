const { execSync } = require('child_process');
const fs = require('fs');

const ORGANIZATION = 'avidxchange';
const PROJECT = 'User Interface Center of Excellence';
const PROJECT_ENCODED = encodeURIComponent(PROJECT);
const REPO_ID = `${PROJECT.replace(/\s/g, '-')}.wiki`;
const BASE_URL = `https://dev.azure.com/${ORGANIZATION}/${PROJECT_ENCODED}`;
const LRR_BRANCH_URL = `${BASE_URL}/_wiki/wikis/${REPO_ID}/39268/Branching`;

const [
  ,
  ,
  mfeName,
  businessService,
  assignmentGroup,
  capabilityPipelineId,
  capabilityEnvPipelineId,
  spaPipelineId,
  bffPipelineId,
] = process.argv;

const FORMATTED_MFE_NAME = mfeName.replace(/-/g, ' ');

const PAGES = [
  { fileName: 'lrr-overview', path: `LRR/${FORMATTED_MFE_NAME}` },
  { fileName: 'core-requirements', path: `LRR/${FORMATTED_MFE_NAME}/Core Requirements` },
  { fileName: 'access-requirements', path: `LRR/${FORMATTED_MFE_NAME}/Access Requirements` },
  { fileName: 'architecture-design', path: `LRR/${FORMATTED_MFE_NAME}/Architecture and Design` },
  {
    fileName: 'incident-mgmt',
    path: `LRR/${FORMATTED_MFE_NAME}/Operational Support Readiness & Incident Management`,
  },
  { fileName: 'branching', path: `LRR/${FORMATTED_MFE_NAME}/Branching` },
  { fileName: 'pipeline', path: `LRR/${FORMATTED_MFE_NAME}/Pipeline` },
  {
    fileName: 'monitoring-observability',
    path: `LRR/${FORMATTED_MFE_NAME}/Monitoring and Observability`,
  },
  { fileName: 'disaster-recovery', path: `LRR/${FORMATTED_MFE_NAME}/Disaster Recovery` },

  { fileName: 'data-governance', path: `LRR/${FORMATTED_MFE_NAME}/Data Governance` },
];

const PAGE_CONTENT_KEYS = {
  businessService: decodeURIComponent(businessService),
  assignmentGroup: decodeURIComponent(assignmentGroup),
  lrrBranchUrl: LRR_BRANCH_URL,
  capabilityPipelineUrl: buildPipelineUrl(capabilityPipelineId),
  capabilityEnvPipelineUrl: buildPipelineUrl(capabilityEnvPipelineId),
  spaPipelineUrl: buildPipelineUrl(spaPipelineId),
  bffPipelineUrl: buildPipelineUrl(bffPipelineId),
};

createWikiPages();

function createWikiPages() {
  PAGES.forEach(page => {
    const pageContent = getPageContent(page.fileName);
    try {
      const output = execSync(
        `az devops wiki page create --path "${page.path}" --wiki "${REPO_ID}" --content "${pageContent}" --project "${PROJECT}"`,
        { encoding: 'utf8' }
      );
      console.log(`Wiki page "${page.fileName}" created successfully!`);
    } catch (error) {
      console.error('Error creating wiki page:', error);
    }
  });
}

function getPageContent(pageName) {
  let pageContent = fs.readFileSync(
    `./tools/pipelines/mfe-generator/wiki-pages/${pageName}.md`,
    'utf8'
  );

  Object.entries(PAGE_CONTENT_KEYS).forEach(([key, value]) => {
    const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
    pageContent = pageContent.replace(regex, value);
  });

  return pageContent;
}

function buildPipelineUrl(id) {
  return `${BASE_URL}/_build?definitionId=${id}`;
}
