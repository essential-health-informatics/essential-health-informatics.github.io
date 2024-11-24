export const testFileName = 'testFile.html';

export const htmlContent = `
<p><img src="../media/test_image.jpg" class="img-fluid" alt="Some description" data-crop="3:1 50%"></p>
`;

export const htmlContentNoDataCropAttribute = `
<p><img src="../media/test_image.jpg" class="img-fluid" alt="Some description"></p>
`;

export const badMethod = 'badMethod';

export const htmlContentBadMethod = `
<p><img src="../media/test_image.jpg" class="img-fluid" alt="Some description" data-crop="${badMethod} 50%"></p>
`;

export const positionBadValue = 'badPosition';

export const htmlContentBadPosition = `
<p><img src="../media/test_image.jpg" class="img-fluid" alt="Some description" data-crop="3:1 ${positionBadValue}"></p>
`;

export const htmlContentNoSrc = `
<p><img class="img-fluid" alt="Some description" data-crop="3:1 50%"></p>
`;

export const htmlContentNoAlt = `
<p><img src="../media/test_image.jpg" class="img-fluid" data-crop="3:1 50%"></p>
`;

export const src = '../media/test_image.jpg';

export const htmlContentNoParent = `
<img src="${src}" class="img-fluid" alt="Some description" data-crop="3:1 50%">
`;

export const mockFiles = [
  'chapters/timeline/england-test/test-1.html',
  'chapters/timeline/wales-test/test-2.html'
];
