import React, { useState, useEffect } from 'react';
import type { Referral } from '../types';
import Button from './Button';
import ConfirmationModal from './ConfirmationModal';

interface ReminderModalProps {
  referral: Referral;
  onClose: () => void;
  onSave: (referralId: string, reminderDate: string | null, reminderNote: string | null) => void;
}

// Helper to format date for datetime-local input
const formatDateTimeForInput = (isoDate: string | null | undefined) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    // Adjust for timezone offset
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
};

const ReminderModal: React.FC<ReminderModalProps> = ({ referral, onClose, onSave }) => {
  const [reminderDate, setReminderDate] = useState(formatDateTimeForInput(referral.reminderDate));
  const [note, setNote] = useState(referral.reminderNote || '');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSave = () => {
    if (reminderDate) {
        const isoString = new Date(reminderDate).toISOString();
        onSave(referral.id, isoString, note);
    }
  };
  
  const handleClear = () => {
      setShowClearConfirm(true);
  };
  
  const confirmAndClear = () => {
      onSave(referral.id, null, null);
      setShowClearConfirm(false);
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
          onClose();
      }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          <h2 className="text-2xl font-bold font-serif text-brand-gray mb-2">Set Reminder</h2>
          <p className="text-gray-600 mb-4">For referral: <span className="font-semibold">{referral.clientName}</span></p>

          <div className="space-y-4">
              <div>
                  <label htmlFor="reminder-datetime" className="block text-sm font-medium text-gray-700">
                      Reminder Date & Time
                  </label>
                  <input
                      type="datetime-local"
                      id="reminder-datetime"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-teal focus:border-brand-teal"
                  />
              </div>
              <div>
                  <label htmlFor="reminder-note" className="block text-sm font-medium text-gray-700">
                      Note (Optional)
                  </label>
                  <textarea
                      id="reminder-note"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g., Follow up on proposal..."
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-teal focus:border-brand-teal"
                  />
              </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center space-x-2">
            <div>
              {referral.reminderDate && (
                  <Button onClick={handleClear} variant="secondary" className="bg-red-600 hover:bg-red-700 focus:ring-red-500 py-2 px-4 text-sm">
                      Clear Reminder
                  </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button onClick={onClose} variant="outline" className="py-2 px-4 text-sm">
                  Cancel
              </Button>
              <Button onClick={handleSave} variant="primary" className="py-2 px-4 text-sm" disabled={!reminderDate}>
                  Save Reminder
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
          isOpen={showClearConfirm}
          title="Clear Reminder"
          message="Are you sure you want to clear this reminder? This action cannot be undone."
          onConfirm={confirmAndClear}
          onClose={() => setShowClearConfirm(false)}
          confirmText="Yes, Clear It"
      />
    </>
  );
};

export default ReminderModal;