import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAppointmentInput } from '../src/services/appointment.service';
import { ApiError } from '../src/utils/ApiError';

test('normalizes appointment input and defaults to pending status', () => {
  const normalized = normalizeAppointmentInput({
    name: '  Jane Doe  ',
    phone: ' 9876543210 ',
    email: ' jane@example.com ',
    treatmentId: 'korean-glass-skin',
    treatmentName: ' Korean Glass Skin ',
    preferredDate: '2026-08-03',
    preferredTime: ' 10:30 AM ',
    message: '  Please confirm my slot.  ',
  });

  assert.equal(normalized.name, 'Jane Doe');
  assert.equal(normalized.phone, '9876543210');
  assert.equal(normalized.email, 'jane@example.com');
  assert.equal(normalized.treatmentId, 'korean-glass-skin');
  assert.equal(normalized.treatmentName, 'Korean Glass Skin');
  assert.equal(normalized.preferredDate, '2026-08-03');
  assert.equal(normalized.preferredTime, '10:30 AM');
  assert.equal(normalized.message, 'Please confirm my slot.');
  assert.equal(normalized.status, 'pending');
});

test('rejects missing required appointment fields', () => {
  assert.throws(
    () => normalizeAppointmentInput({ name: 'Jane', phone: '123', email: 'jane@example.com' }),
    (error: unknown) => {
      assert.ok(error instanceof ApiError);
      return (error as ApiError).statusCode === 400;
    },
  );
});
