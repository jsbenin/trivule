import { TrivuleForm } from '../core';
import { RuleCallBack } from '../types';

export const same: RuleCallBack = (value, inputName, _type, element) => {
  if (!element) {
    throw new Error("Element is required for 'same' rule");
  }
  const trInputInstance = (element as TrivuleForm).get(inputName as string);
  if (trInputInstance) {
    return {
      passes: trInputInstance.getValue() === value,
      value: value,
    };
  }

  return {
    passes: false,
    value: value,
  };
};
