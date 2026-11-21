import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        paddingBlock: '4px',
        paddingInline: 'max(16px, env(safe-area-inset-left, 0px)) max(16px, env(safe-area-inset-right, 0px))',
        paddingBlockEnd: 'max(4px, env(safe-area-inset-bottom, 0px))',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <Link
          to="/mcp-instructions"
          className="builder-footer-link"
        >
          <BookOpen style={{ width: 13, height: 13 }} aria-hidden="true" />
          MCP Instructions
        </Link>
      </div>
    </footer>
  );
}
