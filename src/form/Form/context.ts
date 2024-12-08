import { createContext, useContext } from 'react';
import type { FormStore } from '.';
import type { PluginsType } from '../../plugins';

export const FormContext = createContext<FormStore<any, any>>(null as unknown as FormStore<any, any>);

export const useFormContext = <Values = any, P extends PluginsType = PluginsType>() => {
  return useContext<FormStore<Values, P>>(FormContext);
};

export const useFormInstance = useFormContext;
