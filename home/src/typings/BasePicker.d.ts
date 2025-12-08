// home/src/typings/BasePicker.d.ts

export interface BasePickerProps {
    // Data/State Properties
    value?: any; // Used in destructuring
    format?: string; // Used in useDateValues and wrapperProps
    initialFocusedDate?: any; // Used in destructuring

    // Option Flags
    autoOk?: boolean; // Used in destructuring
    disabled?: boolean; // Used in destructuring and inputProps
    readOnly?: boolean; // Used in destructuring and inputProps
    
    // Event Handlers
    onAccept?: (date: any) => void; // Used in destructuring and acceptDate
    onChange: (date: any) => void; // Used in destructuring and acceptDate
    onError?: (error: any, value: any) => void; // Used in destructuring and useEffect
    
    // Display
    variant?: 'inline' | 'static' | 'dialog' | string; // Used in destructuring and pickerProps (simulating autoOk)
}

// Default export if needed (keep to be safe)
declare const content: any;
export default content;