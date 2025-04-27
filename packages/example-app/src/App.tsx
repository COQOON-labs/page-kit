import { useState } from 'react';
import DocumentExample from './DocumentExample';
import CustomComponentsExample from './CustomComponentsExample';

function App() {
  const [activeExample, setActiveExample] = useState<'document' | 'custom'>('document');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Page Kit Examples</h1>
            <nav className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-md ${
                  activeExample === 'document' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => setActiveExample('document')}
              >
                Document Example
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  activeExample === 'custom' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => setActiveExample('custom')}
              >
                Custom Components
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="mt-4">
        {activeExample === 'document' ? <DocumentExample /> : <CustomComponentsExample />}
      </main>
    </div>
  );
}

export default App; 