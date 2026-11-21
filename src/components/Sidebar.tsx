import React, { useState } from 'react';
import { FileText, Image, Puzzle, Settings, Menu, ChevronDown, ChevronRight, Map } from 'lucide-react';
import { StepType, StepCategory } from '../types/blueprint';

interface SidebarProps {
  onAddStep: (type: StepType) => void;
  blueprintTitle: string;
  onTitleChange: (title: string) => void;
  phpVersion: string;
  onPhpVersionChange: (v: string) => void;
  wpVersion: string;
  onWpVersionChange: (v: string) => void;
  mobileHidden?: boolean;
}

const PHP_VERSIONS = ['7.4', '8.0', '8.1', '8.2', '8.3'];

const WP_VERSIONS: { value: string; label: string; group?: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: '7.0', label: '7.0 (Armstrong)', group: 'WordPress 7' },
  { value: '6.9', label: '6.9 (Lively)', group: 'WordPress 6' },
  { value: '6.8', label: '6.8 (Cecil)', group: 'WordPress 6' },
  { value: '6.7', label: '6.7 (Rollins)', group: 'WordPress 6' },
  { value: '6.6', label: '6.6 (Dorothea)', group: 'WordPress 6' },
  { value: '6.5', label: '6.5 (Regina)', group: 'WordPress 6' },
  { value: '6.4', label: '6.4 (Shirley)', group: 'WordPress 6' },
  { value: '6.3', label: '6.3 (Lionel)', group: 'WordPress 6' },
  { value: '6.2', label: '6.2 (Dolphy)', group: 'WordPress 6' },
];

const STEP_CATEGORIES: StepCategory[] = [
  { name: 'Content', steps: ['addPage', 'addPost', 'addMedia'], color: 'blue' },
  { name: 'Structure', steps: ['setHomepage', 'setPostsPage', 'createNavigationMenu'], color: 'indigo' },
  { name: 'Extensions', steps: ['installPlugin', 'installTheme'], color: 'green' },
  { name: 'Launch View', steps: ['setLandingPage'], color: 'purple' },
  { name: 'Onboarding', steps: ['guidedTour'], color: 'orange' },
];

const STEP_ICONS = {
  addPost: FileText, addPage: FileText, addMedia: Image,
  setLandingPage: Settings, setHomepage: FileText, setPostsPage: FileText,
  installPlugin: Puzzle, installTheme: Puzzle,
  setSiteOption: Settings, defineWpConfigConst: Settings, login: Settings,
  importWxr: Settings, addClientRole: Settings, createNavigationMenu: Menu,
  guidedTour: Map,
};

const STEP_LABELS = {
  addPost: 'Add Post', addPage: 'Add Page', addMedia: 'Add Media',
  setLandingPage: 'Set Landing Page', setHomepage: 'Set Home Page',
  setPostsPage: 'Set Posts Page', installPlugin: 'Install Plugin',
  installTheme: 'Install Theme', setSiteOption: 'Site Option',
  defineWpConfigConst: 'WP Config', login: 'Login', importWxr: 'Import WXR',
  addClientRole: 'Client Role', createNavigationMenu: 'Set Navigation Menu',
  guidedTour: 'Guided Tour',
};

const WP_FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

export function Sidebar({
  onAddStep,
  blueprintTitle,
  onTitleChange,
  phpVersion,
  onPhpVersionChange,
  wpVersion,
  onWpVersionChange,
  mobileHidden = false,
}: SidebarProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  return (
    <aside
      aria-label="Blueprint settings and step catalog"
      className={`builder-panel builder-sidebar${mobileHidden ? ' builder-panel--mobile-hidden' : ''}`}
      style={{ fontFamily: WP_FONT }}
    >
      {/* Site title */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border-light)' }}>
        <label
          htmlFor="site-title-input"
          style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}
        >
          Site Title
        </label>
        <input
          id="site-title-input"
          type="text"
          value={blueprintTitle}
          onChange={e => onTitleChange(e.target.value)}
          placeholder="My WordPress Site"
          className="blueprint-input"
          style={{
            width: '100%', padding: '7px 10px', fontSize: 13,
            boxSizing: 'border-box', fontFamily: WP_FONT,
          }}
        />
      </div>

      {/* Step categories */}
      <div className="builder-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {STEP_CATEGORIES.map(category => (
          <div key={category.name} style={{ marginBottom: 4 }}>
            <div style={{
              padding: '10px 16px 4px',
              fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {category.name}
            </div>
            {category.steps.map(stepType => {
              const Icon = STEP_ICONS[stepType];
              return (
                <button
                  key={stepType}
                  type="button"
                  onClick={() => onAddStep(stepType)}
                  className="builder-step-btn"
                  style={{ fontFamily: WP_FONT }}
                >
                  <Icon size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} aria-hidden="true" />
                  <span>{STEP_LABELS[stepType]}</span>
                </button>
              );
            })}
          </div>
        ))}

        {/* Advanced section */}
        <div style={{ borderTop: '1px solid var(--border-light)', marginTop: 4 }}>
          <button
            type="button"
            aria-expanded={advancedOpen}
            aria-controls="builder-advanced-settings"
            onClick={() => setAdvancedOpen(o => !o)}
            className="builder-step-btn"
            style={{
              justifyContent: 'space-between',
              padding: '10px 16px',
              fontFamily: WP_FONT,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Advanced
            </span>
            {advancedOpen
              ? <ChevronDown size={13} style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />
              : <ChevronRight size={13} style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />}
          </button>

          {advancedOpen && (
            <div id="builder-advanced-settings" style={{ padding: '8px 16px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* WordPress version */}
              <div>
                <label
                  htmlFor="wp-version-select"
                  style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}
                >
                  WordPress Version
                </label>
                <select
                  id="wp-version-select"
                  value={wpVersion}
                  onChange={e => onWpVersionChange(e.target.value)}
                  className="blueprint-input"
                  style={{
                    width: '100%', padding: '6px 8px', fontSize: 12,
                    fontFamily: WP_FONT, cursor: 'pointer',
                  }}
                >
                  <option value="latest">Latest</option>
                  <optgroup label="WordPress 7">
                    {WP_VERSIONS.filter(v => v.group === 'WordPress 7').map(v => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="WordPress 6">
                    {WP_VERSIONS.filter(v => v.group === 'WordPress 6').map(v => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* PHP version */}
              <div>
                <label
                  htmlFor="php-version-select"
                  style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}
                >
                  PHP Version
                </label>
                <select
                  id="php-version-select"
                  value={phpVersion}
                  onChange={e => onPhpVersionChange(e.target.value)}
                  className="blueprint-input"
                  style={{
                    width: '100%', padding: '6px 8px', fontSize: 12,
                    fontFamily: WP_FONT, cursor: 'pointer',
                  }}
                >
                  {PHP_VERSIONS.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
