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

export const yamlObjectStr = `- section: ../../../../root/chapters/index.qmd
  contents:
    - ../../../../root/chapters/1-introduction/index.qmd
    - ../../../../root/chapters/13-governance/index.qmd
    - section: ../../../../root/chapters/2-what-is-digital/index.qmd
      contents:
        - ../../../../root/chapters/2-what-is-digital/1-digital.qmd
        - ../../../../root/chapters/2-what-is-digital/2-hardware.qmd
        - ../../../../root/chapters/2-what-is-digital/3-software.qmd
        - ../../../../root/chapters/2-what-is-digital/4-key-digital-concepts-in-health-informatics.qmd
    - section: ../../../../root/chapters/28-authors-guide/index.qmd
      contents:
        - ../../../../root/chapters/28-authors-guide/1-technical-guide.qmd
    - ../../../../root/chapters/29-todo.qmd
    - section: ../../../../root/chapters/3-health-and-disease/index.qmd
      contents:
        - ../../../../root/chapters/3-health-and-disease/1-what-is-health.qmd
    - ../../../../root/chapters/4-healthcare-professionals-facing-systems/index.qmd
    - ../../../../root/chapters/4-healthcare-professionals-facing-systems/test-1/index.qmd
    - section: ../../../../root/chapters/4-healthcare-professionals-facing-systems/test-1/test-2/index.qmd
      contents:
        - ../../../../root/chapters/4-healthcare-professionals-facing-systems/test-1/test-2/test-3.qmd
    - ../../../../root/chapters/4-healthcare-professionals-facing-systems/test-1/test-2/a-test-3/index.qmd
    - section: ../../../../root/chapters/4-healthcare-professionals-facing-systems/test-1/test-2/a-test-3/test-4/index.qmd
      contents:
        - ../../../../root/chapters/4-healthcare-professionals-facing-systems/test-1/test-2/a-test-3/test-4/b-test.qmd
    - section: ../../../../root/chapters/9-clinical-decision-support-systems/index.qmd
      contents:
        - ../../../../root/chapters/9-clinical-decision-support-systems/1-medical-calculators.qmd
        - ../../../../root/chapters/9-clinical-decision-support-systems/2-alert-systems.qmd
        - ../../../../root/chapters/9-clinical-decision-support-systems/3-rules-based.qmd
        - ../../../../root/chapters/9-clinical-decision-support-systems/4-models-based.qmd`;

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
`;
export const finalChapterFileName = '/root/chapters/a-folder/index.qmd';

export const finalChapterFileContents =
  '---\n' +
  'title: Chapters\n' +
  'sidebar: false\n' +
  '---\n' +
  '\n' +
  '\n' +
  '## Index (makeshift)\n' +
  '\n' +
  '* [Index (makeshift)](/chapters/1-introduction/index.qmd)\n' +
  '\n' +
  '\n' +
  '## Index (makeshift)\n' +
  '\n' +
  '* [Index (makeshift)](/chapters/2-what-is-digital/index.qmd)\n' +
  '* [Digital (makeshift)](/chapters/2-what-is-digital/1-digital.qmd)\n' +
  '* [Hardware (makeshift)](/chapters/2-what-is-digital/2-hardware.qmd)\n' +
  '* [Software (makeshift)](/chapters/2-what-is-digital/3-software.qmd)\n' +
  '* [Key Digital Concepts In Health Informatics (makeshift)](/chapters/2-what-is-digital/4-key-digital-concepts-in-health-informatics.qmd)\n' +
  '\n' +
  '\n' +
  '## Index (makeshift)\n' +
  '\n' +
  '* [Index (makeshift)](/chapters/3-health-and-disease/index.qmd)\n' +
  '* [What Is Health (makeshift)](/chapters/3-health-and-disease/1-what-is-health.qmd)\n' +
  '\n' +
  '\n' +
  '## Index (makeshift)\n' +
  '\n' +
  '* [Index (makeshift)](/chapters/7-history-of-digital-health-across-the-globe/index.qmd)\n' +
  '\n' +
  '### Index (makeshift)\n' +
  '\n' +
  '* [Index (makeshift)](/chapters/7-history-of-digital-health-across-the-globe/1-england/index.qmd)\n' +
  '\n' +
  '\n' +
  '## Index (makeshift)\n' +
  '\n' +
  '* [Index (makeshift)](/chapters/9-clinical-decision-support-systems/index.qmd)\n' +
  '* [Medical Calculators (makeshift)](/chapters/9-clinical-decision-support-systems/1-medical-calculators.qmd)\n' +
  '* [Alert Systems (makeshift)](/chapters/9-clinical-decision-support-systems/2-alert-systems.qmd)\n' +
  '* [Rules Based (makeshift)](/chapters/9-clinical-decision-support-systems/3-rules-based.qmd)\n' +
  '* [Models Based (makeshift)](/chapters/9-clinical-decision-support-systems/4-models-based.qmd)\n' +
  '\n' +
  '\n' +
  '## Index (makeshift)\n' +
  '\n' +
  '* [Index (makeshift)](/chapters/28-authors-guide/index.qmd)\n' +
  '* [Technical Guide (makeshift)](/chapters/28-authors-guide/1-technical-guide.qmd)\n' +
  '\n' +
  '\n' +
  '## Todo (makeshift)\n' +
  '\n' +
  '* [Todo (makeshift)](/chapters/29-todo.qmd)\n';

export const missingFrontMatter = `---
---

Hello World
`;

export const hasFrontMatter = `---
Title: A title
---

Hello World
`;
