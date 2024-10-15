import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import superjson from 'superjson';

interface AsyncStorageProps {
  key: string;
  defaultValue?: any;
}

/**
 * Access the AsyncStorage API from a React component.
 */
export const useAsyncStorage = <T>({
  key,
  defaultValue,
}: AsyncStorageProps) => {
  const [value, internalSetValue] = useState<T>(defaultValue);

  const setValue = (value: T) => {
    AsyncStorage.setItem(key, superjson.stringify(value)).then(() => {
      internalSetValue(value);
    });
  };

  useEffect(() => {
    AsyncStorage.getItem(key).then((value) => {
      if (!value) return;

      try {
        const parsedValue = superjson.parse(value);
        internalSetValue(parsedValue as T);
      } catch (error) {
        console.error('Error parsing AsyncStorage value:', error);
      }
    });
  }, [key, defaultValue]);

  return [value, setValue] as [T, (value: T) => void];
};
