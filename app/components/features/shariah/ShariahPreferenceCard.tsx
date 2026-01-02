/**
 * @file ShariahPreferenceCard.tsx
 * @description Card component displaying client's Shariah compliance preferences
 * @module components/features/shariah
 */

'use client';

import { useState } from 'react';
import type { ShariahPreference } from '@/types/compliance.types';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';

interface ShariahPreferenceCardProps {
  clientId: string;
  clientName: string;
  preference?: ShariahPreference;
  onSave?: (preference: ShariahPreference) => void;
}

export default function ShariahPreferenceCard({
  clientName,
  preference,
  onSave,
}: ShariahPreferenceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ShariahPreference>(
    preference || {
      requiresShariahCompliance: false,
      preferenceLevel: 'NO_PREFERENCE',
      notes: '',
    }
  );

  const handleSave = () => {
    onSave?.(formData);
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Shariah Compliance Preference
        </h3>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-3">
          <div>
            <span className="text-sm text-slate-600">Client:</span>
            <p className="font-medium text-slate-900">{clientName}</p>
          </div>

          <div>
            <span className="text-sm text-slate-600">Requires Shariah Compliance:</span>
            <p className="font-medium text-slate-900">
              {formData.requiresShariahCompliance ? 'Yes' : 'No'}
            </p>
          </div>

          {formData.requiresShariahCompliance && (
            <>
              <div>
                <span className="text-sm text-slate-600">Preference Level:</span>
                <p className="font-medium text-slate-900">
                  {formData.preferenceLevel === 'STRICT' && '🔒 Strict'}
                  {formData.preferenceLevel === 'PREFERRED' && '⭐ Preferred'}
                  {formData.preferenceLevel === 'NO_PREFERENCE' && '— No Preference'}
                </p>
              </div>

              {formData.certificationAuthority && (
                <div>
                  <span className="text-sm text-slate-600">Certification Authority:</span>
                  <p className="font-medium text-slate-900">{formData.certificationAuthority}</p>
                </div>
              )}

              {formData.notes && (
                <div>
                  <span className="text-sm text-slate-600">Notes:</span>
                  <p className="text-slate-700">{formData.notes}</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.requiresShariahCompliance}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requiresShariahCompliance: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">
                Requires Shariah Compliance
              </span>
            </label>
          </div>

          {formData.requiresShariahCompliance && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Preference Level
                </label>
                <select
                  value={formData.preferenceLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferenceLevel: e.target.value as ShariahPreference['preferenceLevel'],
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="NO_PREFERENCE">No Preference</option>
                  <option value="PREFERRED">Preferred</option>
                  <option value="STRICT">Strict</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Certification Authority
                </label>
                <input
                  type="text"
                  value={formData.certificationAuthority || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      certificationAuthority: e.target.value,
                    })
                  }
                  placeholder="e.g., AAOIFI, Shariah Board"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Additional notes about Shariah preferences..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} size="sm">
              Save Changes
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setFormData(
                  preference || {
                    requiresShariahCompliance: false,
                    preferenceLevel: 'NO_PREFERENCE',
                    notes: '',
                  }
                );
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
