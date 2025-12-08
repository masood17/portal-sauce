// Inside .../typings/date.d.ts

// This imports the base type from the core date adapter library, 
// which is necessary for the Material UI pickers to function correctly.
import { DateIOType } from '@date-io/core';

/**
 * Type alias to satisfy the missing MaterialUiPickersDate import.
 * It is typically an alias for the DateIOType or the native Date object.
 * We include '| null' because date pickers return null when empty.
 */
export type MaterialUiPickersDate = DateIOType | null;