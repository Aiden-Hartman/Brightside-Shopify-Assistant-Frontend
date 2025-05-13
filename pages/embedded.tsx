import React from 'react';
import { AssistantShell } from '../components/AssistantShell';
import Head from 'next/head';

const EmbeddedPage: React.FC = () => {
  return (
    <>
      <Head>
        <base href="/embedded" />
      </Head>
      <div className="min-h-screen bg-white">
        <AssistantShell />
      </div>
    </>
  );
};

export default EmbeddedPage; 