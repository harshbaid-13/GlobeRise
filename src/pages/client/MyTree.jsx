import { useState } from 'react';

const MyTree = () => {
  const [selectedLevel, setSelectedLevel] = useState(1);

  // Mock tree data
  const treeData = {
    level1: { left: 0, right: 1 },
    level2: { left: 0, right: 0 },
    level3: { left: 0, right: 0 },
  };

  const TreeLevel = ({ level, data }) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Level {level}</h3>
      <div className="flex justify-center space-x-8">
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6 min-w-[200px] text-center">
          <div className="text-sm font-semibold text-gray-600 mb-2">Left</div>
          <div className="text-2xl font-bold text-gray-800">{data.left}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-6 min-w-[200px] text-center">
          <div className="text-sm font-semibold text-gray-600 mb-2">Right</div>
          <div className="text-2xl font-bold text-gray-800">{data.right}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Tree</h1>

      {/* Tree Visualization */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Level
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(Number(e.target.value))}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
          </select>
        </div>

        {/* Tree Levels */}
        <div className="space-y-6">
          {[1, 2, 3].map((level) => (
            <TreeLevel
              key={level}
              level={level}
              data={treeData[`level${level}`] || { left: 0, right: 0 }}
            />
          ))}
        </div>

        {/* Tree Summary */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tree Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Total Left</div>
              <div className="text-xl font-bold text-gray-800">
                {Object.values(treeData).reduce((sum, d) => sum + d.left, 0)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Total Right</div>
              <div className="text-xl font-bold text-gray-800">
                {Object.values(treeData).reduce((sum, d) => sum + d.right, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTree;

