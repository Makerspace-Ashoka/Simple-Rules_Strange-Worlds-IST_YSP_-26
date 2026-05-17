import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import LifeBackground from '@site/src/components/LifeBackground';

export default function LayoutWrapper(props: React.ComponentProps<typeof OriginalLayout>) {
  return (
    <>
      <LifeBackground />
      <OriginalLayout {...props} />
    </>
  );
}
