export const timelineFiles = [
  '/root/chapters/timelines/index.qmd',
  '/root/chapters/timelines/2-wales/index.qmd',
  '/root/chapters/timelines/1-england/index.qmd',
  '/root/chapters/timelines/1-england/timeline.ts',
  '/root/chapters/timelines/1-england/first-use-of-hit.qmd',
  '/root/chapters/timelines/1-england/computers-first-used-for-administrative-purposes.qmd',
  '/root/chapters/timelines/1-england/colossus-computer.qmd'
];

export const timelineFilesNoDotTs = [
  '/root/chapters/timelines/index.qmd',
  '/root/chapters/timelines/2-wales/index.qmd',
  '/root/chapters/timelines/1-england/index.qmd',
  '/root/chapters/timelines/1-england/first-use-of-hit.qmd',
  '/root/chapters/timelines/1-england/computers-first-used-for-administrative-purposes.qmd',
  '/root/chapters/timelines/1-england/colossus-computer.qmd'
];

export const timelineFilesOutput = [
  '/root/chapters/timelines/index.qmd',
  '/root/chapters/timelines/2-wales/index.qmd',
  '/root/chapters/timelines/1-england/index.qmd'
];

export const notQmdFile = '/root/chapters/index.html';

export const notAllQmdFiles = [
  `${notQmdFile}`,
  '/root/chapters/a-folder/a-file.qmd',
  '/root/chapters/a-folder/another-file.qmd'
];

export const qmdFilesMissingIndex = [
  '/root/chapters/index.qmd',
  '/root/chapters/a-folder/a-file.qmd',
  '/root/chapters/a-folder/another-file.qmd'
];

export const folderMissingIndex = ['/root/chapters/a-folder/'];

export const qmdFiles = [
  '/root/chapters/index.qmd',
  '/root/chapters/29-todo.qmd',
  '/root/chapters/9-clinical-decision-support-systems/index.qmd',
  '/root/chapters/9-clinical-decision-support-systems/4-models-based.qmd',
  '/root/chapters/9-clinical-decision-support-systems/3-rules-based.qmd',
  '/root/chapters/9-clinical-decision-support-systems/2-alert-systems.qmd',
  '/root/chapters/9-clinical-decision-support-systems/1-medical-calculators.qmd',
  '/root/chapters/4-healthcare-professionals-facing-systems/index.qmd',
  '/root/chapters/4-healthcare-professionals-facing-systems/test-1/index.qmd',
  '/root/chapters/4-healthcare-professionals-facing-systems/test-1/test-2/test-3.qmd',
  '/root/chapters/4-healthcare-professionals-facing-systems/test-1/test-2/index.qmd',
  '/root/chapters/4-healthcare-professionals-facing-systems/test-1/test-2/a-test-3/index.qmd',
  '/root/chapters/4-healthcare-professionals-facing-systems/test-1/test-2/a-test-3/test-4/index.qmd',
  '/root/chapters/4-healthcare-professionals-facing-systems/test-1/test-2/a-test-3/test-4/b-test.qmd',
  '/root/chapters/3-health-and-disease/index.qmd',
  '/root/chapters/3-health-and-disease/1-what-is-health.qmd',
  '/root/chapters/28-authors-guide/index.qmd',
  '/root/chapters/28-authors-guide/1-technical-guide.qmd',
  '/root/chapters/2-what-is-digital/index.qmd',
  '/root/chapters/2-what-is-digital/4-key-digital-concepts-in-health-informatics.qmd',
  '/root/chapters/2-what-is-digital/3-software.qmd',
  '/root/chapters/2-what-is-digital/2-hardware.qmd',
  '/root/chapters/2-what-is-digital/1-digital.qmd',
  '/root/chapters/13-governance/index.qmd',
  '/root/chapters/1-introduction/index.qmd'
];

export const yamlObjectStr = `- chapters/index.qmd
- chapters/1-introduction/index.qmd
- section: chapters/2-what-is-digital/index.qmd
  contents:
    - chapters/2-what-is-digital/1-digital.qmd
    - chapters/2-what-is-digital/2-hardware.qmd
    - chapters/2-what-is-digital/3-software.qmd
    - chapters/2-what-is-digital/4-key-digital-concepts-in-health-informatics.qmd
- section: chapters/3-health-and-disease/index.qmd
  contents:
    - chapters/3-health-and-disease/1-what-is-health.qmd
- section: chapters/4-healthcare-professionals-facing-systems/index.qmd
  contents:
    - chapters/4-healthcare-professionals-facing-systems/test-1/index.qmd
    - section: chapters/4-healthcare-professionals-facing-systems/test-1/test-2/index.qmd
      contents:
        - chapters/4-healthcare-professionals-facing-systems/test-1/test-2/test-3.qmd
    - chapters/4-healthcare-professionals-facing-systems/test-1/test-2/a-test-3/index.qmd
    - section: chapters/4-healthcare-professionals-facing-systems/test-1/test-2/a-test-3/test-4/index.qmd
      contents:
        - chapters/4-healthcare-professionals-facing-systems/test-1/test-2/a-test-3/test-4/b-test.qmd
- section: chapters/9-clinical-decision-support-systems/index.qmd
  contents:
    - chapters/9-clinical-decision-support-systems/1-medical-calculators.qmd
    - chapters/9-clinical-decision-support-systems/2-alert-systems.qmd
    - chapters/9-clinical-decision-support-systems/3-rules-based.qmd
    - chapters/9-clinical-decision-support-systems/4-models-based.qmd
- chapters/13-governance/index.qmd
- section: chapters/28-authors-guide/index.qmd
  contents:
    - chapters/28-authors-guide/1-technical-guide.qmd
- chapters/29-todo.qmd`;

export const aFolder = '/root/chapters/a-folder';

export const notAnIndexFile = `${aFolder}/not-an-index-file.qmd`;

export const sidebarYamlPath = '/root/sidebar.yml';

export const yamlObject2 = [
  'chapters/index.qmd',
  'chapters/1-introduction/index.qmd',
  {
    section: 'chapters/2-what-is-digital/index.qmd',
    contents: [
      'chapters/2-what-is-digital/1-digital.qmd',
      'chapters/2-what-is-digital/2-hardware.qmd',
      'chapters/2-what-is-digital/3-software.qmd',
      'chapters/2-what-is-digital/4-key-digital-concepts-in-health-informatics.qmd'
    ]
  },
  {
    section: 'chapters/3-health-and-disease/index.qmd',
    contents: ['chapters/3-health-and-disease/1-what-is-health.qmd']
  },
  {
    section: 'chapters/7-history-of-digital-health-across-the-globe/index.qmd',
    contents: [
      'chapters/7-history-of-digital-health-across-the-globe/1-england/index.qmd'
    ]
  },
  {
    section: 'chapters/9-clinical-decision-support-systems/index.qmd',
    contents: [
      'chapters/9-clinical-decision-support-systems/1-medical-calculators.qmd',
      'chapters/9-clinical-decision-support-systems/2-alert-systems.qmd',
      'chapters/9-clinical-decision-support-systems/3-rules-based.qmd',
      'chapters/9-clinical-decision-support-systems/4-models-based.qmd'
    ]
  },
  {
    section: 'chapters/28-authors-guide/index.qmd',
    contents: ['chapters/28-authors-guide/1-technical-guide.qmd']
  },
  'chapters/29-todo.qmd'
];

export const yamlObjectStringified = `website:
  sidebar:
    collapse-level: 1
    contents:
      - chapters/index.qmd
      - chapters/1-introduction/index.qmd
      - section: chapters/2-what-is-digital/index.qmd
        contents:
          - chapters/2-what-is-digital/1-digital.qmd
          - chapters/2-what-is-digital/2-hardware.qmd
          - chapters/2-what-is-digital/3-software.qmd
          - chapters/2-what-is-digital/4-key-digital-concepts-in-health-informatics.qmd
      - section: chapters/3-health-and-disease/index.qmd
        contents:
          - chapters/3-health-and-disease/1-what-is-health.qmd
      - section: chapters/7-history-of-digital-health-across-the-globe/index.qmd
        contents:
          - chapters/7-history-of-digital-health-across-the-globe/1-england/index.qmd
      - section: chapters/9-clinical-decision-support-systems/index.qmd
        contents:
          - chapters/9-clinical-decision-support-systems/1-medical-calculators.qmd
          - chapters/9-clinical-decision-support-systems/2-alert-systems.qmd
          - chapters/9-clinical-decision-support-systems/3-rules-based.qmd
          - chapters/9-clinical-decision-support-systems/4-models-based.qmd
      - section: chapters/28-authors-guide/index.qmd
        contents:
          - chapters/28-authors-guide/1-technical-guide.qmd
      - chapters/29-todo.qmd
      - text: Code Documentation
        href: chapters/code-documentation/index.html`;

export const finalChapterFileName = '/chapters/a-folder/index.qmd';

export const finalChapterFileNameUsed = '../chapters/a-folder/index.qmd';

export const finalChapterFileContents = `---
title: Chapters
sidebar: false
---

## Index (makeshift)

- [Index (makeshift)](/chapters/1-introduction/index.qmd)

## Index (makeshift)

- [Index (makeshift)](/chapters/2-what-is-digital/index.qmd)
- [Digital (makeshift)](/chapters/2-what-is-digital/1-digital.qmd)
- [Hardware (makeshift)](/chapters/2-what-is-digital/2-hardware.qmd)
- [Software (makeshift)](/chapters/2-what-is-digital/3-software.qmd)
- [Key Digital Concepts In Health Informatics (makeshift)](/chapters/2-what-is-digital/4-key-digital-concepts-in-health-informatics.qmd)

## Index (makeshift)

- [Index (makeshift)](/chapters/3-health-and-disease/index.qmd)
- [What Is Health (makeshift)](/chapters/3-health-and-disease/1-what-is-health.qmd)

## Index (makeshift)

- [Index (makeshift)](/chapters/7-history-of-digital-health-across-the-globe/index.qmd)

### Index (makeshift)

- [Index (makeshift)](/chapters/7-history-of-digital-health-across-the-globe/1-england/index.qmd)

## Index (makeshift)

- [Index (makeshift)](/chapters/9-clinical-decision-support-systems/index.qmd)
- [Medical Calculators (makeshift)](/chapters/9-clinical-decision-support-systems/1-medical-calculators.qmd)
- [Alert Systems (makeshift)](/chapters/9-clinical-decision-support-systems/2-alert-systems.qmd)
- [Rules Based (makeshift)](/chapters/9-clinical-decision-support-systems/3-rules-based.qmd)
- [Models Based (makeshift)](/chapters/9-clinical-decision-support-systems/4-models-based.qmd)

## Index (makeshift)

- [Index (makeshift)](/chapters/28-authors-guide/index.qmd)
- [Technical Guide (makeshift)](/chapters/28-authors-guide/1-technical-guide.qmd)

## Todo (makeshift)

- [Todo (makeshift)](/chapters/29-todo.qmd)

## Code Documentation

- [Code Documentation](/chapters/code-documentation/index.html)`;

export const missingFrontMatter = `---
---

Hello World
`;

export const hasFrontMatter = `---
Title: A title
---

Hello World
`;
