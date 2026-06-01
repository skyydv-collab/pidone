import React, { useState } from 'react';
import { useEditorStore, ProjectElement } from '../stores/editorStore';
import { Settings, Type, Palette } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const { elements, selectedElementId, updateElement } = useEditorStore();
  const selectedElement = elements.find((e) => e.id === selectedElementId);

  if (!selectedElement) {
    return (
      <div className="w-64 bg-gray-900 border-l border-gray-700 p-4 text-gray-400 text-sm">
        Select an element to edit properties
      </div>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    updateElement(selectedElementId!, { [key]: value });
  };

  return (
    <div className="w-64 bg-gray-900 border-l border-gray-700 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 pb-4 border-b border-gray-700">
          <Settings size={18} />
          <span className="font-medium">Properties</span>
        </div>

        {/* Position & Size */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">Position & Size</h3>
          
          <div>
            <label className="text-xs text-gray-400">X Position</label>
            <input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) => handlePropertyChange('x', parseFloat(e.target.value))}
              className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Y Position</label>
            <input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) => handlePropertyChange('y', parseFloat(e.target.value))}
              className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400">Width</label>
              <input
                type="number"
                value={Math.round(selectedElement.width)}
                onChange={(e) => handlePropertyChange('width', parseFloat(e.target.value))}
                className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Height</label>
              <input
                type="number"
                value={Math.round(selectedElement.height)}
                onChange={(e) => handlePropertyChange('height', parseFloat(e.target.value))}
                className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Rotation & Opacity */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">Appearance</h3>

          <div>
            <label className="text-xs text-gray-400">Rotation</label>
            <input
              type="range"
              min="0"
              max="360"
              value={selectedElement.rotation}
              onChange={(e) => handlePropertyChange('rotation', parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{Math.round(selectedElement.rotation)}°</span>
          </div>

          <div>
            <label className="text-xs text-gray-400">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={selectedElement.opacity}
              onChange={(e) => handlePropertyChange('opacity', parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{Math.round(selectedElement.opacity * 100)}%</span>
          </div>
        </div>

        {/* Text Properties */}
        {selectedElement.type === 'text' && (
          <div className="space-y-3 pt-4 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Type size={16} />
              Text
            </h3>

            <div>
              <label className="text-xs text-gray-400">Text Content</label>
              <textarea
                value={selectedElement.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
                className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                rows={3}
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">Font Size</label>
              <input
                type="number"
                value={selectedElement.fontSize || 24}
                onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">Font Family</label>
              <select
                value={selectedElement.fontFamily || 'Arial'}
                onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
              >
                <option>Arial</option>
                <option>Georgia</option>
                <option>Verdana</option>
                <option>Times New Roman</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 flex items-center gap-2">
                <Palette size={14} />
                Color
              </label>
              <input
                type="color"
                value={selectedElement.color || '#ffffff'}
                onChange={(e) => handlePropertyChange('color', e.target.value)}
                className="w-full h-8 bg-gray-800 border border-gray-700 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Shape Properties */}
        {selectedElement.type === 'shape' && (
          <div className="space-y-3 pt-4 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Palette size={16} />
              Fill Color
            </h3>

            <input
              type="color"
              value={selectedElement.color || '#ff0000'}
              onChange={(e) => handlePropertyChange('color', e.target.value)}
              className="w-full h-10 bg-gray-800 border border-gray-700 rounded cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};
