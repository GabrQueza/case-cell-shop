'use client';

import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ChakraProvider } from '@chakra-ui/react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => {
    const c = createCache({ key: 'css' });
    c.compat = true;
    const prevInsert = c.insert;
    let inserted: string[] = [];

    c.insert = (...args) => {
      const serialized = args[1];
      if (!inserted.includes(serialized.name)) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache: c, flush };
  });

  useServerInsertedHTML(() => {
    const names = cache.flush();
    if (names.length === 0) return null;

    let styles = '';
    for (const name of names) {
      const style = cache.cache.inserted[name];
      if (typeof style === 'string') {
        styles += style;
      }
    }

    if (!styles) return null;

    return (
      <style
        key={cache.cache.key}
        data-emotion={`${cache.cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <EmotionCacheProvider value={cache.cache}>
      <ChakraProvider>{children}</ChakraProvider>
    </EmotionCacheProvider>
  );
}
