/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { NotificationTemplate } from '../types';
import { FileText, Save, Eye, Edit2, Variable, Check, AlertCircle } from 'lucide-react';

export const TemplateManager: React.FC = () => {
  const {
    templates,
    updateTemplate
  } = useNotifications();

  const [activeTemplateId, setActiveTemplateId] = useState<string>('t-1');
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const [success, setSuccess] = useState(false);

  const selectedTemplate = templates.find(t => t.id === activeTemplateId) || templates[0];

  // Temp form buffers
  const [subject, setSubject] = useState(selectedTemplate?.subject || '');
  const [body, setBody] = useState(selectedTemplate?.body || '');

  // Keep buffers in sync when selecting a different template
  React.useEffect(() => {
    if (selectedTemplate) {
      setSubject(selectedTemplate.subject || '');
      setBody(selectedTemplate.body || '');
    }
  }, [activeTemplateId]);

  const handleSave = () => {
    if (selectedTemplate) {
      updateTemplate(selectedTemplate.id, {
        subject: selectedTemplate.type === 'email' ? subject : undefined,
        body
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  const getCompiledPreview = () => {
    if (!selectedTemplate) return '';
    let compiled = body;
    // Mock dictionary for replacement preview values
    const mockVars: Record<string, string> = {
      name: 'Alexander Sterling',
      workspaceId: 'workspace-nova-44a',
      ip: '192.168.1.1',
      device: 'MacBook Pro M3 (Chrome 125)',
      amount: '45.00',
      taskId: 'task-771b'
    };

    Object.entries(mockVars).forEach(([key, val]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      compiled = compiled.replace(regex, val);
    });

    return compiled;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="template-manager">
      {/* Templates Sidebar selector (cols 4) */}
      <div className="lg:col-span-4 bg-slate-900 border border-white/5 rounded-xl p-4 space-y-4 shadow-lg">
        <h3 className="text-sm font-semibold text-slate-200">Corporate Notification Templates</h3>
        <p className="text-[11px] text-slate-400">Manage standardized system email newsletters and mobile push alerts.</p>

        <div className="space-y-1.5 pt-2">
          {templates.map(t => {
            const isActive = t.id === activeTemplateId;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTemplateId(t.id)}
                className={`w-full flex flex-col p-3 rounded-xl border text-left transition-all ${
                  isActive 
                    ? 'bg-indigo-600/10 border-indigo-500/30' 
                    : 'bg-transparent border-transparent hover:bg-slate-950/40'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-bold text-slate-200 truncate">{t.name}</span>
                  <span className="text-[8px] uppercase font-bold text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-white/5 shrink-0 ml-2">
                    {t.type}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 truncate">Modified: {t.lastModified}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Template Workspace (cols 8) */}
      <div className="lg:col-span-8 bg-slate-900 border border-white/5 rounded-xl p-5 space-y-4 shadow-lg">
        {selectedTemplate ? (
          <>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-300">Layout Canvas: {selectedTemplate.name}</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                  <Variable className="h-3 w-3 text-indigo-400" />
                  <span>Variables: {selectedTemplate.variables.map(v => `{{${v}}}`).join(', ')}</span>
                </div>
              </div>

              {/* Mode switch edit / preview */}
              <div className="flex bg-slate-950 p-0.5 rounded-lg border border-white/10 shrink-0">
                <button
                  onClick={() => setEditorMode('edit')}
                  className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded ${
                    editorMode === 'edit' ? 'bg-indigo-600 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Code</span>
                </button>
                <button
                  onClick={() => setEditorMode('preview')}
                  className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded ${
                    editorMode === 'preview' ? 'bg-indigo-600 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="h-3 w-3" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {/* Template subject / title input (if email) */}
            {selectedTemplate.type === 'email' && editorMode === 'edit' && (
              <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-white/5">
                <label className="text-[10px] uppercase text-slate-500 font-bold">Mail Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-transparent border-none text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-0 font-medium"
                />
              </div>
            )}

            {/* Content canvas */}
            {editorMode === 'edit' ? (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-500 font-bold">Template Payload Content (Markdown/HTML)</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-4 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none"
                />
              </div>
            ) : (
              <div className="border border-white/5 bg-slate-950 rounded-xl overflow-hidden min-h-[300px]">
                {selectedTemplate.type === 'email' ? (
                  <iframe
                    title="Template HTML Preview"
                    srcDoc={getCompiledPreview()}
                    className="w-full min-h-[340px] bg-white border-none rounded-b-xl"
                  />
                ) : (
                  <div className="p-8 flex items-center justify-center min-h-[300px]">
                    {/* Device Push Preview card mock */}
                    <div className="w-full max-w-sm bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl space-y-2">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] text-slate-500">
                        <span className="font-bold flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 text-indigo-400" />
                          <span>TaskNova System Push</span>
                        </span>
                        <span>just now</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-normal">{getCompiledPreview()}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Save operations bottom bar */}
            {editorMode === 'edit' && (
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[10px] text-slate-500 font-medium">Auto-format HTML/Plain text enabled</span>
                <div className="flex items-center gap-3">
                  {success && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      Template Saved Successfully
                    </span>
                  )}
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 text-xs text-slate-200 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center text-slate-500 space-y-2">
            <FileText className="h-10 w-10 text-slate-600 mx-auto" />
            <h4 className="text-xs font-semibold text-slate-300">Select Template</h4>
            <p className="text-[11px] text-slate-500">Pick a template form from the left sidebar to start editing.</p>
          </div>
        )}
      </div>
    </div>
  );
};
