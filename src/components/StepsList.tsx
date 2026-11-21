import React, { useRef, useState } from 'react';
import { FileText, Image, Puzzle, Settings, X, Menu, GripVertical, Map } from 'lucide-react';
import { Step } from '../types/blueprint';

interface StepsListProps {
  steps: Step[];
  selectedStep: Step | null;
  onSelectStep: (step: Step) => void;
  onRemoveStep: (stepId: string) => void;
  onReorderSteps: (steps: Step[]) => void;
  mobileHidden?: boolean;
}

const STEP_ICONS: Record<string, React.ElementType> = {
  addPost: FileText, addPage: FileText, addMedia: Image,
  setLandingPage: Settings, setHomepage: FileText, setPostsPage: FileText,
  installPlugin: Puzzle, installTheme: Puzzle,
  setSiteOption: Settings, defineWpConfigConst: Settings, login: Settings,
  importWxr: Settings, addClientRole: Settings, createNavigationMenu: Menu,
  guidedTour: Map,
};

const STEP_LABELS: Record<string, string> = {
  addPost: 'Add Post', addPage: 'Add Page', addMedia: 'Add Media',
  setLandingPage: 'Set Landing Page', setHomepage: 'Set Homepage',
  setPostsPage: 'Set Posts Page', installPlugin: 'Install Plugin',
  installTheme: 'Install Theme', setSiteOption: 'Site Option',
  defineWpConfigConst: 'WP Config', login: 'Login', importWxr: 'Import WXR',
  addClientRole: 'Client Role', createNavigationMenu: 'Set Navigation Menu',
  guidedTour: 'Guided Tour',
};

const STEP_ACCENT: Record<string, string> = {
  addPost: '#2271b1', addPage: '#2271b1', addMedia: '#2271b1',
  installPlugin: '#00a32a', installTheme: '#00a32a',
  setHomepage: '#787c82', setPostsPage: '#787c82', createNavigationMenu: '#787c82',
  setLandingPage: '#dba617', setSiteOption: '#dba617',
  defineWpConfigConst: '#d63638', login: '#d63638',
  importWxr: '#50575e', addClientRole: '#50575e',
  guidedTour: '#c17d11',
};

const WP_FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

export function StepsList({
  steps,
  selectedStep,
  onSelectStep,
  onRemoveStep,
  onReorderSteps,
  mobileHidden = false,
}: StepsListProps) {
  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === dropIndex) {
      setDragOverIndex(null);
      dragIndex.current = null;
      return;
    }
    const reordered = [...steps];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(dropIndex, 0, moved);
    onReorderSteps(reordered);
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  return (
    <aside
      aria-label="Blueprint steps"
      className={`builder-panel builder-steps${mobileHidden ? ' builder-panel--mobile-hidden' : ''}`}
      style={{ fontFamily: WP_FONT }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Blueprint Steps</h2>
          {steps.length > 0 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 20, height: 20, paddingInline: 5, background: 'var(--accent)', color: '#fff',
              borderRadius: 999, fontSize: 11, fontWeight: 700,
            }}>
              {steps.length}
            </span>
          )}
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '3px 0 0' }}>
          Drag to reorder your setup sequence
        </p>
      </div>

      {/* Steps */}
      <div className="builder-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {steps.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{
              width: 48, height: 48, background: 'var(--bg-subtle)',
              border: '1px solid var(--border)', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Settings style={{ width: 20, height: 20, color: 'var(--text-muted)' }} aria-hidden="true" />
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>No steps yet</p>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>Add steps from the catalog to build your blueprint</p>
          </div>
        ) : (
          <ol role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[step.type] || Settings;
              const isSelected = selectedStep?.id === step.id;
              const accent = STEP_ACCENT[step.type] || 'var(--text-secondary)';
              const isDragOver = dragOverIndex === index;
              const label = STEP_LABELS[step.type] || step.type;
              const subtitle = step.data?.postTitle || step.data?.option;

              return (
                <li
                  key={step.id}
                  draggable
                  onDragStart={e => handleDragStart(e, index)}
                  onDragOver={e => handleDragOver(e, index)}
                  onDrop={e => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`builder-step-row${isSelected ? ' builder-step-row--selected' : ''}`}
                  style={{
                    borderInlineStartColor: isSelected ? accent : 'transparent',
                    background: isDragOver ? 'var(--accent-bg)' : undefined,
                    borderBlockEnd: isDragOver
                      ? '2px solid var(--accent)'
                      : '1px solid var(--border-light)',
                    opacity: dragIndex.current === index ? 0.4 : 1,
                  }}
                >
                  {/* Drag handle */}
                  <div
                    aria-hidden="true"
                    style={{
                      paddingInlineStart: 6, cursor: 'grab',
                      color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                      flexShrink: 0,
                    }}
                    onMouseDown={e => e.stopPropagation()}
                  >
                    <GripVertical size={13} />
                  </div>

                  {/* Selectable step button */}
                  <button
                    type="button"
                    onClick={() => onSelectStep(step)}
                    aria-current={isSelected ? 'step' : undefined}
                    className="builder-step-select"
                    style={{ fontFamily: WP_FONT }}
                  >
                    <span style={{
                      width: 18, minWidth: 18, textAlign: 'center',
                      fontSize: 11, fontWeight: 600,
                      color: isSelected ? accent : 'var(--text-muted)',
                    }}>
                      {index + 1}
                    </span>

                    <Icon size={14} style={{ color: isSelected ? accent : 'var(--text-secondary)', flexShrink: 0 }} aria-hidden="true" />

                    <span style={{ flex: 1, minWidth: 0, display: 'block' }}>
                      <span style={{ display: 'block', fontSize: 13, fontWeight: isSelected ? 600 : 400, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {label}
                      </span>
                      {subtitle && (
                        <span style={{ display: 'block', fontSize: 11, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {subtitle}
                        </span>
                      )}
                    </span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => onRemoveStep(step.id)}
                    aria-label={`Remove step ${index + 1}: ${label}`}
                    title={`Remove ${label}`}
                    className="builder-step-delete"
                  >
                    <X size={13} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </aside>
  );
}
