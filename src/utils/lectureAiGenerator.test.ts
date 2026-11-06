/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEMO_DOCUMENT_FILES,
  generateLectureAiSummary,
  inferSubjectAndGrade,
  synthesizeLectureVisualization,
  extractTextFromFile
} from './lectureAiGenerator';

test('lecture AI generator tests', async (t) => {
  await t.test('has complete and valid demo document files for quick teacher testing', () => {
    assert.ok(DEMO_DOCUMENT_FILES.length >= 4);
    for (const demo of DEMO_DOCUMENT_FILES) {
      assert.ok(demo.id.length > 0);
      assert.ok(demo.fileName.length > 0);
      assert.ok(demo.title.length > 0);
      assert.ok(demo.rawText.length > 50);
      assert.ok(['pdf', 'docx', 'txt'].includes(demo.fileType));
    }
  });

  await t.test('inferSubjectAndGrade detects subjects and grades correctly', () => {
    const physics = inferSubjectAndGrade('Định luật Newton gia tốc khối lượng', 'Giao_An_Vat_Ly_10.docx');
    assert.equal(physics.subject, 'Vật lý');
    assert.equal(physics.grade, 'Lớp 10');

    const chemistry = inferSubjectAndGrade('Este lipit phản ứng xà phòng hóa este của phenol', 'Hoa_Hoc_12.pdf');
    assert.equal(chemistry.subject, 'Hóa học');
    assert.equal(chemistry.grade, 'Lớp 12');

    const history = inferSubjectAndGrade('Khởi nghĩa giành chính quyền cách mạng tháng tám thực dân Pháp', 'Lich_Su_11.txt');
    assert.equal(history.subject, 'Lịch sử');
    assert.equal(history.grade, 'Lớp 11');
  });

  await t.test('generateLectureAiSummary automatically generates structured summary without teacher input', () => {
    const sampleText = DEMO_DOCUMENT_FILES[0].rawText;
    const summary = generateLectureAiSummary(sampleText, 'Ba Định Luật Newton');

    assert.ok(summary.includes('TÓM TẮT') && summary.includes('AI'));
    assert.ok(summary.includes('Khái Niệm & Luận Điểm'));
    assert.ok(summary.includes('Phương Trình / Công Thức'));
    assert.ok(summary.length > 100);
  });

  await t.test('synthesizeLectureVisualization creates complete mindmap, slides, and video storyboard', () => {
    const sample = DEMO_DOCUMENT_FILES[1];
    const result = synthesizeLectureVisualization(sample.rawText, sample.fileName);

    assert.ok(result.id.startsWith('lec-ai-'));
    assert.equal(result.subject, 'Hóa học');
    assert.equal(result.grade, 'Lớp 12');

    // Mindmap validation
    assert.ok(result.mindmap.centralNode.label.length > 0);
    assert.equal(result.mindmap.branches.length, 3);
    for (const branch of result.mindmap.branches) {
      assert.ok(branch.label.length > 0);
      assert.ok(branch.color.startsWith('#'));
      assert.ok(branch.children.length >= 2);
    }

    // Slides validation
    assert.ok(result.slides.length >= 4);
    assert.ok(result.slides[0].title.length > 0);
    assert.ok(result.slides[0].keyPoints.length > 0);
    assert.ok(result.slides[0].teacherCallout.length > 0);

    // Video script validation
    assert.ok(result.videoScenes.length >= 3);
    assert.ok(result.videoScenes[0].voiceoverScript.length > 0);
  });

  await t.test('extractTextFromFile extracts text from plain text File objects', async () => {
    const file = new File(['Nội dung giáo án thử nghiệm'], 'test_lesson.txt', { type: 'text/plain' });
    const text = await extractTextFromFile(file);
    assert.equal(text, 'Nội dung giáo án thử nghiệm');
  });
});
