import React, { useEffect, useRef, useState } from 'react';
import { Play, Zap, Download, Upload, Grid3x3, Save, RotateCcw, Sparkles, Share2, Link2, Loader2, Moon, Sun } from 'lucide-react';
import { Blueprint } from '../types/blueprint';

interface HeaderProps {
  blueprint: Blueprint;
  title: string;
  stepCount: number;
  onExportBlueprint: () => void;
  onImportBlueprint: () => void;
  onShowGallery: () => void;
  onSaveBlueprint: () => void;
  onReset: () => void;
  onOpenAiSidebar: () => void;
  onShowAiGenerator?: () => void;
  onSharePlayground?: () => void;
  onShowSharedPlaygrounds?: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const WP_FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

export function Header({
  blueprint,
  title,
  stepCount,
  onExportBlueprint,
  onImportBlueprint,
  onShowGallery,
  onSaveBlueprint,
  onReset,
  onOpenAiSidebar,
  onShowAiGenerator,
  onSharePlayground,
  onShowSharedPlaygrounds,
  isDark,
  onToggleTheme,
}: HeaderProps) {
  const [isLaunching, setIsLaunching] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = toolbarRef.current;
    if (!bar || 'focusGroup' in HTMLElement.prototype) return;

    const getItems = () => Array.from(bar.querySelectorAll<HTMLButtonElement>('button'));
    const items = getItems();
    items.forEach((b, i) => { b.tabIndex = i === 0 ? 0 : -1; });

    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLButtonElement;
      const currentItems = getItems();
      if (currentItems.includes(target)) {
        currentItems.forEach(b => { b.tabIndex = b === target ? 0 : -1; });
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const currentItems = getItems();
      const idx = currentItems.indexOf(document.activeElement as HTMLButtonElement);
      if (idx === -1) return;

      const rtl = getComputedStyle(bar).direction === 'rtl';
      let nextIdx = -1;
      if (e.key === 'ArrowRight') nextIdx = (idx + (rtl ? -1 : 1) + currentItems.length) % currentItems.length;
      else if (e.key === 'ArrowLeft') nextIdx = (idx + (rtl ? 1 : -1) + currentItems.length) % currentItems.length;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = currentItems.length - 1;

      if (nextIdx !== -1) {
        e.preventDefault();
        currentItems.forEach((b, i) => { b.tabIndex = i === nextIdx ? 0 : -1; });
        currentItems[nextIdx]?.focus();
      }
    };

    bar.addEventListener('focusin', onFocusIn);
    bar.addEventListener('keydown', onKeyDown);
    return () => {
      bar.removeEventListener('focusin', onFocusIn);
      bar.removeEventListener('keydown', onKeyDown);
    };
  }, [onShowSharedPlaygrounds, onSharePlayground]);

  const unicodeSafeBase64Encode = (str: string): string => {
    const utf8Bytes = new TextEncoder().encode(str);
    const binaryString = Array.from(utf8Bytes).map(byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
  };

  const createPlaygroundUrl = () => {
    try {
      const validSteps = blueprint.steps.filter(step => {
        switch (step.step) {
          case 'installPlugin':
            return step.pluginData && (step.pluginData.url || step.pluginData.slug);
          case 'installTheme':
            return step.themeData && (step.themeData.url || step.themeData.slug);
          case 'wp-cli':
            return step.command && step.command.trim();
          case 'addMedia':
            return step.command && step.command.includes('wp media import');
          case 'setSiteOptions':
            return step.options && Object.keys(step.options).length > 0;
          case 'defineWpConfigConst':
            return step.consts && Object.keys(step.consts).length > 0;
          case 'importWxr':
            return step.file && step.file.url;
          case 'login':
            return step.username;
          case 'addClientRole':
            return step.name && step.capabilities && step.capabilities.length > 0;
          default:
            return true;
        }
      });

      const playgroundBlueprint = {
        landingPage: blueprint.landingPage,
        preferredVersions: blueprint.preferredVersions,
        phpExtensionBundles: ['kitchen-sink'],
        steps: validSteps,
      };

      return `https://playground.wordpress.net/#${unicodeSafeBase64Encode(JSON.stringify(playgroundBlueprint))}`;
    } catch (error) {
      console.error('Error creating playground URL:', error);
      alert('Error creating playground URL: ' + (error as Error).message);
      return 'https://playground.wordpress.net/';
    }
  };

  const handleLaunch = () => {
    setIsLaunching(true);
    window.open(createPlaygroundUrl(), '_blank');
    setTimeout(() => setIsLaunching(false), 2000);
  };

  const handleDownload = () => {
    const jsonString = JSON.stringify(blueprint, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-blueprint.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasSteps = stepCount > 0;

  return (
    <header className="builder-header" style={{ fontFamily: WP_FONT }}>
      <div className="builder-header-inner">

        {/* ── Logo ── */}
        <div className="builder-brand">
          <div style={{
            width: 36, height: 36, background: 'var(--accent)', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Zap style={{ width: 18, height: 18, color: '#fff' }} aria-hidden="true" />
          </div>
          <div>
            <h1 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, margin: 0 }}>
              Pootle Playground
            </h1>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.2 }}>
              Blueprint Generator v1.6
            </div>
          </div>
        </div>

        {/* ── Toolbar + Primary Actions ── */}
        <div className="builder-header-controls">
          <div
            ref={toolbarRef}
            role="toolbar"
            aria-label="Blueprint actions"
            className="builder-toolbar"
            {...({ focusgroup: 'toolbar wrap' } as React.HTMLAttributes<HTMLDivElement>)}
          >
            <span role="separator" aria-orientation="vertical" className="builder-toolbar-divider" />

            <div role="group" aria-label="Blueprint file" className="builder-toolbar-group">
              <button
                type="button"
                onClick={() => { if (hasSteps) onReset(); }}
                aria-disabled={!hasSteps}
                aria-label="Reset blueprint"
                title="Reset blueprint"
                className="builder-icon-btn"
              >
                <RotateCcw style={{ width: 15, height: 15 }} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onShowGallery}
                aria-label="Browse gallery"
                title="Browse gallery"
                className="builder-icon-btn"
              >
                <Grid3x3 style={{ width: 15, height: 15 }} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onImportBlueprint}
                aria-label="Import blueprint JSON"
                title="Import blueprint JSON"
                className="builder-icon-btn"
              >
                <Download style={{ width: 15, height: 15 }} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => { if (hasSteps) handleDownload(); }}
                aria-disabled={!hasSteps}
                aria-label="Export blueprint JSON"
                title="Export blueprint JSON"
                className="builder-icon-btn"
              >
                <Upload style={{ width: 15, height: 15 }} aria-hidden="true" />
              </button>
            </div>

            <div role="group" aria-label="AI and sharing" className="builder-toolbar-group">
              <button
                type="button"
                onClick={onShowAiGenerator || onOpenAiSidebar}
                aria-label="Generate with AI"
                title="Generate with AI"
                className="builder-icon-btn builder-icon-btn--accent"
              >
                <Sparkles style={{ width: 15, height: 15 }} aria-hidden="true" />
              </button>

              {onShowSharedPlaygrounds && (
                <button
                  type="button"
                  onClick={onShowSharedPlaygrounds}
                  aria-label="My shared links"
                  title="My shared links"
                  className="builder-icon-btn"
                >
                  <Link2 style={{ width: 15, height: 15 }} aria-hidden="true" />
                </button>
              )}

              {onSharePlayground && (
                <button
                  type="button"
                  onClick={onSharePlayground}
                  aria-label="Share this Playground"
                  title="Share this Playground"
                  className="builder-icon-btn"
                >
                  <Share2 style={{ width: 15, height: 15 }} aria-hidden="true" />
                </button>
              )}
            </div>

            <div role="group" aria-label="Appearance" className="builder-toolbar-group">
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label="Dark mode"
                aria-pressed={isDark}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="builder-icon-btn"
              >
                {isDark
                  ? <Sun style={{ width: 15, height: 15 }} aria-hidden="true" />
                  : <Moon style={{ width: 15, height: 15 }} aria-hidden="true" />}
              </button>
            </div>
          </div>

          <span role="separator" aria-orientation="vertical" className="builder-toolbar-divider" />

          <div className="builder-primary-actions">
            <button
              type="button"
              onClick={onSaveBlueprint}
              disabled={!hasSteps}
              className="builder-pill-btn builder-pill-btn--secondary"
              style={{ fontFamily: WP_FONT }}
            >
              <Save style={{ width: 12, height: 12 }} aria-hidden="true" />
              Save
            </button>

            <button
              type="button"
              onClick={handleLaunch}
              disabled={isLaunching}
              className="builder-pill-btn builder-pill-btn--primary"
              style={{ fontFamily: WP_FONT }}
            >
              {isLaunching
                ? <><Loader2 style={{ width: 13, height: 13 }} className="animate-spin" aria-hidden="true" /> Launching…</>
                : <><Play style={{ width: 13, height: 13 }} aria-hidden="true" /> Launch</>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
