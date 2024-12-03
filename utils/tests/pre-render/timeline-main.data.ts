import { DatesContainer } from '../../timeline-main';

// INPUTS

export const title = 'England NHS Timeline';

export const outputFilename = 'output.qmd';

export const outputFilenameBad = 'aBadOutputFileName.jpg';

export const datesContainers: DatesContainer[] = [
  {
    year: '1943',
    image_src: '/media/colossus-computer.jpg',
    alt_text: 'Colossus computer',
    header: 'Colossus computer',
    content:
      'The first electronic computer. Used as a codebreaker in World War II.',
    further_details: true
  },
  {
    year: '1952',
    image_src: '/media/mcbee-punch-card.jpg',
    alt_text: 'Another description',
    header: 'First use of HIT',
    content:
      'Dr Arthur Rappoport uses the McBee Manual Punch Card in pathology labs.',
    further_details: false
  },
  {
    year: '1950s',
    image_src: '/media/hand-written-table.jpg',
    alt_text: 'Another description',
    header: 'Computers first used for administrative purposes',
    content: '...',
    further_details: 'https://www.example.com'
  }
];

export const expectedWriteFileSync = `---
title: "${title}"
sidebar: false
---

\`\`\`{=html}
<div id="timeline" class="timeline">
`;

export const mockFiles = [
  'chapters/timeline/england-test/timeline.ts',
  'chapters/timeline/wales-test/timeline.ts'
];

export const path = {
  basePath: '/fake/path',
  directory: 'directoryFake',
  filename: 'fileFake.ts'
};

export const mockModule = {
  datesContainers: [
    {
      // test datesContainers
    }
  ],
  metaData: {
    // test metadata
  }
};

export const metaData = {
  title: 'Test title'
};

// EXPECTED OUTPUTS

export const expectedAppendFileSync = [
  `
    <div class=\"date-container\">
      <div class=\"bubble left\">
        <p class=\"container-header\">1943</p>
        <img class=\"observed-image\" src=\"/media/colossus-computer.jpg\" alt=\"Colossus computer\" style=\"width: 100%;\">
        <button class=\"collapsible\">Colossus computer</button>
        <div class=\"collapsible-content hidden\">
          <p>The first electronic computer. Used as a codebreaker in World War II.</p><p><a href=\"colossus-computer.html\" target=\"_blank\">Further details...</a></p>
        </div>
      </div>
    </div>
    `,
  `
    <div class=\"date-container\">
      <div class=\"bubble right\">
        <p class=\"container-header\">1952</p>
        <img class=\"observed-image\" src=\"/media/mcbee-punch-card.jpg\" alt=\"Another description\" style=\"width: 100%;\">
        <button class=\"collapsible\">First use of HIT</button>
        <div class=\"collapsible-content hidden\">
          <p>Dr Arthur Rappoport uses the McBee Manual Punch Card in pathology labs.</p>
        </div>
      </div>
    </div>
    `,
  `
    <div class=\"date-container\">
      <div class=\"bubble left\">
        <p class=\"container-header\">1950s</p>
        <img class=\"observed-image\" src=\"/media/hand-written-table.jpg\" alt=\"Another description\" style=\"width: 100%;\">
        <button class=\"collapsible\">Computers first used for administrative purposes</button>
        <div class=\"collapsible-content hidden\">
          <p>...</p><p><a href=\"https://www.example.com\" target=\"_blank\">Further details...</a></p>
        </div>
      </div>
    </div>
    `,
  `
</div>

<script type=\"module\" src=\"/static/js/timeline-runtime.js\"></script>
\`\`\`
`
];
