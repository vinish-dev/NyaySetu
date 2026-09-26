import test from 'node:test';
import assert from 'node:assert/strict';
import { createNewCase } from '../src/data/mockData';

test('createNewCase - initializes complete case model with non-empty fields', () => {
  const newCase = createNewCase('Unfair Security Deposit Withholding', 'Tenancy & Rent');

  assert.ok(newCase.id.startsWith('case-'));
  assert.ok(newCase.caseId.startsWith('NS-'));
  assert.strictEqual(newCase.title, 'Unfair Security Deposit Withholding');
  assert.strictEqual(newCase.category, 'Tenancy & Rent');
  assert.strictEqual(newCase.status, 'In Preparation');
  assert.strictEqual(typeof newCase.completionScore, 'number');
  assert.ok(newCase.completionScore >= 0 && newCase.completionScore <= 100);
});

test('createNewCase - provides default fallback title and category', () => {
  const defaultCase = createNewCase('', '');
  assert.strictEqual(defaultCase.title, 'New Dispute Matter');
  assert.strictEqual(defaultCase.category, 'Consumer Dispute');
});

test('createNewCase - provides essential readiness checklist items', () => {
  const caseItem = createNewCase('Consumer Defect', 'Consumer Dispute');
  assert.ok(Array.isArray(caseItem.readinessChecklist));
  assert.ok(caseItem.readinessChecklist.length > 0);

  const checklistNames = caseItem.readinessChecklist.map((item) => item.name);
  assert.ok(checklistNames.includes('Incident details'));
  assert.ok(checklistNames.includes('Timeline'));
  assert.ok(checklistNames.includes('Payment proof'));
});

test('createNewCase - attaches potential filing channels and disclaimers', () => {
  const caseItem = createNewCase('Consumer Defect', 'Consumer Dispute');
  assert.ok(caseItem.potentialFilingChannels);
  assert.ok(caseItem.potentialFilingChannels.name.length > 0);
  assert.ok(caseItem.potentialFilingChannels.disclaimer.includes('NyaySetu does not provide legal representation'));
});
