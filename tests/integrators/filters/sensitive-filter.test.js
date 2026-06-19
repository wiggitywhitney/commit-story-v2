// ABOUTME: Tests for sensitive-filter.js — redaction of API keys, tokens, and secrets
// ABOUTME: Verifies that diff headers are not redacted and code hunks are
import { describe, it, expect } from 'vitest';
import {
  redactSensitiveData,
  redactDiff,
  redactMessages,
  applySensitiveFilter,
} from '../../../src/integrators/filters/sensitive-filter.js';

describe('redactSensitiveData', () => {
  describe('null/empty input', () => {
    it('returns empty string for null input', () => {
      const result = redactSensitiveData(null);

      expect(result.text).toBe('');
      expect(result.redactions).toEqual([]);
      expect(result.redactionCount).toBe(0);
    });

    it('returns empty string for undefined input', () => {
      const result = redactSensitiveData(undefined);

      expect(result.text).toBe('');
    });

    it('returns empty string for empty string input', () => {
      const result = redactSensitiveData('');

      expect(result.text).toBe('');
      expect(result.redactionCount).toBe(0);
    });
  });

  describe('AWS keys', () => {
    it('redacts AWS access keys (AKIA prefix)', () => {
      const text = 'export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE';
      const result = redactSensitiveData(text);

      expect(result.text).not.toContain('AKIAIOSFODNN7EXAMPLE');
      expect(result.text).toContain('[REDACTED]');
      expect(result.redactionCount).toBeGreaterThan(0);
    });

    it('redacts AWS secret keys', () => {
      const text = 'aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY1';
      const result = redactSensitiveData(text);

      expect(result.text).not.toContain('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY1');
      expect(result.text).toContain('[REDACTED]');
    });
  });

  describe('JWT tokens', () => {
    it('redacts JWT tokens', () => {
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
      const text = `Authorization: Bearer ${jwt}`;
      const result = redactSensitiveData(text);

      expect(result.text).not.toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
      expect(result.redactionCount).toBeGreaterThan(0);
    });
  });

  describe('GitHub tokens', () => {
    it('redacts GitHub personal access tokens (ghp_)', () => {
      const text = 'token: ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij';
      const result = redactSensitiveData(text);

      expect(result.text).not.toContain('ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij');
      expect(result.redactionCount).toBeGreaterThan(0);
    });

    it('redacts GitHub fine-grained PATs (github_pat_)', () => {
      const text = 'GITHUB_TOKEN=github_pat_ABCDEFGHIJKLMNOPQRSTUVWX';
      const result = redactSensitiveData(text);

      expect(result.text).not.toContain('github_pat_ABCDEFGHIJKLMNOPQRSTUVWX');
    });
  });

  describe('Anthropic API keys', () => {
    it('redacts Anthropic API keys (sk-ant-)', () => {
      const text = 'api_key: sk-ant-api03-abcdef1234567890abcdef1234567890';
      const result = redactSensitiveData(text);

      expect(result.text).not.toContain('sk-ant-api03-abcdef1234567890abcdef1234567890');
      expect(result.redactionCount).toBeGreaterThan(0);
    });
  });

  describe('OpenAI API keys', () => {
    it('redacts OpenAI API keys (sk- prefix, 48+ chars)', () => {
      const key = 'sk-' + 'a'.repeat(48);
      const text = `OPENAI_API_KEY="${key}"`;
      const result = redactSensitiveData(text);

      expect(result.text).not.toContain(key);
    });
  });

  describe('private keys', () => {
    it('redacts PEM private keys', () => {
      const text = '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn\n-----END RSA PRIVATE KEY-----';
      const result = redactSensitiveData(text);

      expect(result.text).not.toContain('MIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn');
      expect(result.text).toContain('[REDACTED]');
    });

    it('redacts EC private keys', () => {
      const text = '-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEIONiq6XwMZvA8Lz\n-----END EC PRIVATE KEY-----';
      const result = redactSensitiveData(text);

      expect(result.text).not.toContain('MHQCAQEEIONiq6XwMZvA8Lz');
    });
  });

  describe('Slack tokens', () => {
    it('redacts Slack bot tokens', () => {
      // Construct token from parts to avoid GitHub push protection false positive
      const slackToken = ['xoxb', '123456789012', '123456789012', 'abcdefghijklmnop'].join('-');
      const text = `SLACK_TOKEN=${slackToken}`;
      const result = redactSensitiveData(text);

      expect(result.text).not.toContain(slackToken);
    });
  });

  describe('bearer tokens', () => {
    it('redacts bearer tokens in authorization headers', () => {
      const text = 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9abcdef';
      const result = redactSensitiveData(text);

      expect(result.text).not.toContain('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9abcdef');
    });
  });

  describe('generic secrets', () => {
    it('redacts password assignments', () => {
      const text = 'password=MyS3cretP@ssw0rd!';
      const result = redactSensitiveData(text);

      expect(result.text).not.toContain('MyS3cretP@ssw0rd!');
    });

    it('redacts API key assignments', () => {
      const text = 'api_key: abcdef1234567890abcdefgh';
      const result = redactSensitiveData(text);

      expect(result.text).not.toContain('abcdef1234567890abcdefgh');
    });
  });

  describe('email redaction', () => {
    it('does not redact emails by default', () => {
      const text = 'author: user@example.com';
      const result = redactSensitiveData(text);

      expect(result.text).toContain('user@example.com');
    });

    it('redacts emails when redactEmails is true', () => {
      const text = 'author: user@example.com';
      const result = redactSensitiveData(text, { redactEmails: true });

      expect(result.text).not.toContain('user@example.com');
      expect(result.text).toContain('[REDACTED]');
    });
  });

  describe('custom placeholder', () => {
    it('uses custom placeholder when specified', () => {
      const text = 'token: ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij';
      const result = redactSensitiveData(text, { placeholder: '***' });

      expect(result.text).toContain('***');
      expect(result.text).not.toContain('ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij');
    });
  });

  describe('text without secrets', () => {
    it('returns text unchanged when no secrets found', () => {
      const text = 'This is a normal code review comment with no secrets.';
      const result = redactSensitiveData(text);

      expect(result.text).toBe(text);
      expect(result.redactionCount).toBe(0);
      expect(result.redactions).toEqual([]);
    });
  });

  describe('redaction metadata', () => {
    it('tracks redaction type and length in metadata', () => {
      const text = 'key: AKIAIOSFODNN7EXAMPLE plus ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij';
      const result = redactSensitiveData(text);

      expect(result.redactionCount).toBeGreaterThanOrEqual(2);
      expect(result.redactions.length).toBeGreaterThanOrEqual(2);
      for (const redaction of result.redactions) {
        expect(redaction).toHaveProperty('type');
        expect(redaction).toHaveProperty('length');
        expect(typeof redaction.type).toBe('string');
        expect(typeof redaction.length).toBe('number');
      }
    });
  });
});

describe('redactDiff', () => {
  it('redacts secrets in code hunks', () => {
    const diff = '+api_key: AKIAIOSFODNN7EXAMPLE';
    const result = redactDiff(diff);

    expect(result.text).not.toContain('AKIAIOSFODNN7EXAMPLE');
    expect(result.redactionCount).toBeGreaterThan(0);
  });

  it('does not redact filenames in diff --git header lines', () => {
    const diff = 'diff --git a/src/token-filter.test.js b/src/token-filter.test.js';
    const result = redactDiff(diff);

    expect(result.text).toContain('token-filter.test.js');
    expect(result.text).not.toContain('[REDACTED]');
  });

  it('does not redact filenames in --- header lines', () => {
    const diff = '--- a/src/token-filter.test.js';
    const result = redactDiff(diff);

    expect(result.text).toContain('token-filter.test.js');
    expect(result.text).not.toContain('[REDACTED]');
  });

  it('does not redact filenames in +++ header lines', () => {
    const diff = '+++ b/src/secret-manager.js';
    const result = redactDiff(diff);

    expect(result.text).toContain('secret-manager.js');
    expect(result.text).not.toContain('[REDACTED]');
  });

  it('does not redact filenames in index header lines', () => {
    const diff = 'index abc1234..def5678 100644';
    const result = redactDiff(diff);

    expect(result.text).toContain('abc1234');
    expect(result.text).not.toContain('[REDACTED]');
  });

  it('redacts secrets in code hunks but preserves diff headers in the same diff', () => {
    const diff = [
      'diff --git a/src/token-filter.test.js b/src/token-filter.test.js',
      'index abc1234..def5678 100644',
      '--- a/src/token-filter.test.js',
      '+++ b/src/token-filter.test.js',
      '@@ -1,3 +1,3 @@',
      '-const token = "old_value_here_1234"',
      '+const secret = "AKIAIOSFODNN7EXAMPLE"',
    ].join('\n');
    const result = redactDiff(diff);

    expect(result.text).toContain('token-filter.test.js');
    expect(result.text).not.toContain('AKIAIOSFODNN7EXAMPLE');
    expect(result.redactionCount).toBeGreaterThan(0);
  });
});

describe('redactMessages', () => {
  it('returns empty result for null input', () => {
    const result = redactMessages(null);

    expect(result.messages).toEqual([]);
    expect(result.totalRedactions).toBe(0);
  });

  it('returns empty result for empty array', () => {
    const result = redactMessages([]);

    expect(result.messages).toEqual([]);
    expect(result.totalRedactions).toBe(0);
  });

  it('redacts sensitive data in message content', () => {
    const messages = [
      { type: 'user', content: 'My token is ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij' },
    ];
    const result = redactMessages(messages);

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].content).not.toContain('ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij');
    expect(result.totalRedactions).toBeGreaterThan(0);
  });

  it('preserves other message fields', () => {
    const messages = [
      { type: 'user', content: 'no secrets here', sessionId: 'sess-1', uuid: 'u1' },
    ];
    const result = redactMessages(messages);

    expect(result.messages[0].type).toBe('user');
    expect(result.messages[0].sessionId).toBe('sess-1');
    expect(result.messages[0].uuid).toBe('u1');
  });

  it('tracks redactions by type across messages', () => {
    const messages = [
      { type: 'user', content: 'key: AKIAIOSFODNN7EXAMPLE' },
      { type: 'assistant', content: 'token: ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij' },
    ];
    const result = redactMessages(messages);

    expect(result.totalRedactions).toBeGreaterThanOrEqual(2);
    expect(typeof result.redactionsByType).toBe('object');
  });
});

describe('applySensitiveFilter', () => {
  function _makeContext({
    diff = 'normal diff content',
    commitMessage = 'feat: add feature',
    messages = [],
  } = {}) {
    return {
      commit: {
        hash: 'abc123',
        shortHash: 'abc',
        message: commitMessage,
        subject: commitMessage.split('\n')[0],
        author: 'Test User',
        authorEmail: 'test@example.com',
        timestamp: new Date('2026-02-21T10:00:00Z'),
        diff,
        isMerge: false,
        parentCount: 1,
      },
      chat: {
        messages,
        sessions: new Map(),
        messageCount: messages.length,
        sessionCount: 0,
      },
      metadata: {
        tokenEstimate: 0,
      },
    };
  }

  it('redacts secrets in diff', () => {
    const context = _makeContext({
      diff: '+export API_KEY=AKIAIOSFODNN7EXAMPLE',
    });
    const result = applySensitiveFilter(context);

    expect(result.commit.diff).not.toContain('AKIAIOSFODNN7EXAMPLE');
    expect(result.metadata.sensitiveDataFilter.diffRedactions).toBeGreaterThan(0);
  });

  it('redacts secrets in commit message', () => {
    const context = _makeContext({
      commitMessage: 'fix: remove token ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij from config',
    });
    const result = applySensitiveFilter(context);

    expect(result.commit.message).not.toContain('ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij');
    expect(result.metadata.sensitiveDataFilter.messageRedactions).toBeGreaterThan(0);
  });

  it('redacts secrets in chat messages', () => {
    const context = _makeContext({
      messages: [
        { type: 'user', content: 'My password=SuperSecret123!' },
      ],
    });
    const result = applySensitiveFilter(context);

    expect(result.chat.messages[0].content).not.toContain('SuperSecret123!');
    expect(result.metadata.sensitiveDataFilter.chatRedactions).toBeGreaterThan(0);
  });

  it('calculates total redactions across all sources', () => {
    const context = _makeContext({
      diff: '+key: AKIAIOSFODNN7EXAMPLE',
      commitMessage: 'token: ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij in message',
      messages: [
        { type: 'user', content: 'password=Secret12345678' },
      ],
    });
    const result = applySensitiveFilter(context);

    const stats = result.metadata.sensitiveDataFilter;
    expect(stats.totalRedactions).toBe(
      stats.diffRedactions + stats.messageRedactions + stats.chatRedactions
    );
  });

  it('returns unchanged context when no secrets found', () => {
    const context = _makeContext();
    const result = applySensitiveFilter(context);

    expect(result.commit.diff).toBe('normal diff content');
    expect(result.commit.message).toBe('feat: add feature');
    expect(result.metadata.sensitiveDataFilter.totalRedactions).toBe(0);
  });

  it('passes redactEmails option through', () => {
    const context = _makeContext({
      messages: [
        { type: 'user', content: 'Contact me at user@example.com' },
      ],
    });

    const withoutRedaction = applySensitiveFilter(context, { redactEmails: false });
    expect(withoutRedaction.chat.messages[0].content).toContain('user@example.com');

    const withRedaction = applySensitiveFilter(context, { redactEmails: true });
    expect(withRedaction.chat.messages[0].content).not.toContain('user@example.com');
  });
});
