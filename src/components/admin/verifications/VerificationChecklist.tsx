
import React, { useState } from 'react';

interface ChecklistState {
  idMatch: boolean;
  photoClear: boolean;
  idValid: boolean;
  addressComplete: boolean;
}

interface VerificationChecklistProps {
  initialState?: Partial<ChecklistState>;
}

const VerificationChecklist: React.FC<VerificationChecklistProps> = ({ initialState = {} }) => {
  const [checklist, setChecklist] = useState<ChecklistState>({
    idMatch: initialState.idMatch || false,
    photoClear: initialState.photoClear || false,
    idValid: initialState.idValid || false,
    addressComplete: initialState.addressComplete || false
  });

  return (
    <>
      <h3 className="font-medium mb-4">Verification Checklist</h3>
      <div className="space-y-3">
        <div className="flex items-start">
          <input 
            type="checkbox" 
            id="check-id" 
            className="mt-1 mr-3"
            checked={checklist.idMatch}
            onChange={(e) => setChecklist({...checklist, idMatch: e.target.checked})}
          />
          <label htmlFor="check-id" className="text-sm">
            ID Card matches the provided personal information
          </label>
        </div>
        <div className="flex items-start">
          <input 
            type="checkbox" 
            id="check-photo" 
            className="mt-1 mr-3"
            checked={checklist.photoClear}
            onChange={(e) => setChecklist({...checklist, photoClear: e.target.checked})}
          />
          <label htmlFor="check-photo" className="text-sm">
            Photo on ID is clear and identifiable
          </label>
        </div>
        <div className="flex items-start">
          <input 
            type="checkbox" 
            id="check-valid" 
            className="mt-1 mr-3"
            checked={checklist.idValid}
            onChange={(e) => setChecklist({...checklist, idValid: e.target.checked})}
          />
          <label htmlFor="check-valid" className="text-sm">
            ID Card is valid and not expired
          </label>
        </div>
        <div className="flex items-start">
          <input 
            type="checkbox" 
            id="check-address" 
            className="mt-1 mr-3"
            checked={checklist.addressComplete}
            onChange={(e) => setChecklist({...checklist, addressComplete: e.target.checked})}
          />
          <label htmlFor="check-address" className="text-sm">
            Address information is complete and valid
          </label>
        </div>
      </div>
    </>
  );
};

export default VerificationChecklist;
