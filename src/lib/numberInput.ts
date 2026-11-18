import type { KeyboardEvent } from "react";

// No numeric field of the app accepts negative values (issue #106).
// Use NON_NEGATIVE as the `min` rule of react-hook-form's `register`, and spread
// nonNegativeInputProps on the <input type="number"> so the spinner stops at 0 and
// the minus sign cannot be typed. Zero stays valid.
export const NON_NEGATIVE = { value: 0, message: "No puede ser negativo" } as const;

export const nonNegativeInputProps = {
  min: 0,
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "-" || event.key === "Subtract") event.preventDefault();
  },
};
