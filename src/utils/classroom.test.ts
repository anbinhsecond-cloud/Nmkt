/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateScore,
  calculateAverageScore,
  getAcademicRank,
  calculateClassroomStatistics,
  generateClassroomCsv,
  ClassroomStudent
} from './classroom.ts';

describe('classroom utils tests', () => {
  it('validates scores properly between 0 and 10 with comma/dot support', () => {
    assert.equal(validateScore('8.5'), 8.5);
    assert.equal(validateScore('9,25'), 9.3);
    assert.equal(validateScore('12'), 10);
    assert.equal(validateScore('-3'), 0);
    assert.equal(validateScore(''), null);
    assert.equal(validateScore(null), null);
    assert.equal(validateScore(undefined), null);
    assert.equal(validateScore('abc'), null);
  });

  it('calculates weighted average score according to MOET rules', () => {
    // Student: TX1=8, TX2=9, GK=8, CK=9
    // Sum = 8*1 + 9*1 + 8*2 + 9*3 = 8 + 9 + 16 + 27 = 60
    // Total weight = 1 + 1 + 2 + 3 = 7
    // Avg = 60 / 7 = 8.5714... => 8.6
    const student1: ClassroomStudent = {
      id: 's1',
      name: 'Nguyễn Văn An',
      dob: '12/03/2008',
      email: 'an.nguyen@example.com',
      parentPhone: '0912345678',
      regularScore1: 8,
      regularScore2: 9,
      midtermScore: 8,
      finalScore: 9
    };

    const avg = calculateAverageScore(student1);
    assert.equal(avg, 8.6);

    const rank = getAcademicRank(avg);
    assert.equal(rank.rank, 'Giỏi');
  });

  it('handles partial scores gracefully without breaking', () => {
    const studentPartial: ClassroomStudent = {
      id: 's2',
      name: 'Trần Thị Mai',
      dob: '25/08/2008',
      email: 'mai.tran@example.com',
      parentPhone: '0987654321',
      regularScore1: 7,
      regularScore2: null,
      midtermScore: 8,
      finalScore: null
    };

    // Weight = 7*1 + 8*2 = 23 / (1+2) = 7.666... => 7.7
    const avg = calculateAverageScore(studentPartial);
    assert.equal(avg, 7.7);

    const rank = getAcademicRank(avg);
    assert.equal(rank.rank, 'Khá');
  });

  it('calculates class statistics and CSV generation accurately', () => {
    const students: ClassroomStudent[] = [
      {
        id: '1',
        name: 'Học sinh 1',
        dob: '01/01/2008',
        email: 'hs1@edu.vn',
        parentPhone: '0901112222',
        regularScore1: 9.5,
        regularScore2: 9,
        midtermScore: 9.5,
        finalScore: 9.5
      },
      {
        id: '2',
        name: 'Học sinh 2',
        dob: '02/02/2008',
        email: 'hs2@edu.vn',
        parentPhone: '0903334444',
        regularScore1: 4,
        regularScore2: 4,
        midtermScore: 4.5,
        finalScore: 4
      }
    ];

    const stats = calculateClassroomStatistics(students);
    assert.equal(stats.totalStudents, 2);
    assert.equal(stats.zaloConnectedCount, 2);
    assert.equal(stats.excellentCount, 1);
    assert.equal(stats.needHelpCount, 1);

    const csv = generateClassroomCsv(students, 'Lớp 10A2');
    assert.ok(csv.startsWith('\uFEFF'));
    assert.ok(csv.includes('Học sinh 1'));
    assert.ok(csv.includes('0901112222'));
  });
});
