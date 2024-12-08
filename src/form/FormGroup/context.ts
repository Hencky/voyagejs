import { createContext, useContext } from 'react';
import type { PluginsType } from '../../plugins';
import { GroupStore } from './store';

export const FormGroupContext = createContext<GroupStore<any, any>>(null as unknown as GroupStore<any, any>);

export const useFormGroupContext = <Values = any, P extends PluginsType = PluginsType>() => {
  return useContext<GroupStore<Values, P>>(FormGroupContext);
};
