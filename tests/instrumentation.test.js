// ABOUTME: Tests for OTel SDK bootstrap module (examples/instrumentation.js)
// ABOUTME: Verifies SDK configuration, resource attributes, exporter, instrumentations, and shutdown

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));

// ---------------------------------------------------------------------------
// Save and clear env vars that would override defaults under test
// ---------------------------------------------------------------------------

const savedEnv = {
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
  OTEL_METRICS_EXPORTER: process.env.OTEL_METRICS_EXPORTER,
};
delete process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;
delete process.env.OTEL_METRICS_EXPORTER;

afterAll(() => {
  processExitSpy.mockRestore();
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value !== undefined) {
      process.env[key] = value;
    }
  }
});

// ---------------------------------------------------------------------------
// Mock spies — capture constructor args and method calls
// ---------------------------------------------------------------------------

const mockStart = vi.fn();
const mockShutdown = vi.fn().mockResolvedValue(undefined);
const mockNodeSDKConstructor = vi.fn();

vi.mock('@opentelemetry/sdk-node', () => ({
  NodeSDK: class MockNodeSDK {
    constructor(config) {
      mockNodeSDKConstructor(config);
      this.start = mockStart;
      this.shutdown = mockShutdown;
    }
  },
}));

const mockResourceFromAttributes = vi.fn().mockReturnValue({ attributes: {} });
vi.mock('@opentelemetry/resources', () => ({
  resourceFromAttributes: (...args) => mockResourceFromAttributes(...args),
}));

const mockOTLPTraceConstructor = vi.fn();
vi.mock('@opentelemetry/exporter-trace-otlp-http', () => ({
  OTLPTraceExporter: class MockOTLPTraceExporter {
    constructor(config) {
      mockOTLPTraceConstructor(config);
    }
  },
}));

const mockSimpleSpanProcessorConstructor = vi.fn();
vi.mock('@opentelemetry/sdk-trace-base', () => ({
  SimpleSpanProcessor: class MockSimpleSpanProcessor {
    constructor(exporter) {
      mockSimpleSpanProcessorConstructor(exporter);
    }
  },
}));

const mockOTLPLogConstructor = vi.fn();
vi.mock('@opentelemetry/exporter-logs-otlp-http', () => ({
  OTLPLogExporter: class MockOTLPLogExporter {
    constructor(config) {
      mockOTLPLogConstructor(config);
    }
  },
}));

const mockSimpleLogRecordProcessorConstructor = vi.fn();
const mockLoggerProviderConstructor = vi.fn();
const mockLoggerProviderShutdown = vi.fn().mockResolvedValue(undefined);
const mockLoggerProviderForceFlush = vi.fn().mockResolvedValue(undefined);
vi.mock('@opentelemetry/sdk-logs', () => ({
  LoggerProvider: class MockLoggerProvider {
    constructor(config) {
      mockLoggerProviderConstructor(config);
      this.shutdown = mockLoggerProviderShutdown;
      this.forceFlush = mockLoggerProviderForceFlush;
    }
  },
  SimpleLogRecordProcessor: class MockSimpleLogRecordProcessor {
    constructor(exporter) {
      mockSimpleLogRecordProcessorConstructor(exporter);
    }
  },
}));

const mockSetGlobalLoggerProvider = vi.fn();
vi.mock('@opentelemetry/api-logs', () => ({
  logs: {
    setGlobalLoggerProvider: (...args) => mockSetGlobalLoggerProvider(...args),
  },
}));

const mockPinoInstrumentationConstructor = vi.fn();
vi.mock('@opentelemetry/instrumentation-pino', () => ({
  PinoInstrumentation: class MockPinoInstrumentation {
    constructor(config) {
      mockPinoInstrumentationConstructor(config);
    }
  },
}));

// Spy on process.on to verify shutdown handlers
const processOnSpy = vi.spyOn(process, 'on');

// Spy on process.exit before import so the module's `originalExit` captures
// our spy (a no-op) instead of the real process.exit, which would kill the
// test runner when signal handlers flush and exit.
const originalProcessExit = process.exit;
const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});

// ---------------------------------------------------------------------------
// Import the module under test — triggers side effects against mocks
// ---------------------------------------------------------------------------

beforeAll(async () => {
  await import('../examples/instrumentation.js');
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('instrumentation bootstrap', () => {
  describe('resource attributes', () => {
    it('sets service.name to commit-story', () => {
      expect(mockResourceFromAttributes).toHaveBeenCalledWith(
        expect.objectContaining({
          'service.name': 'commit-story',
        })
      );
    });

    it('sets service.version from package.json', () => {
      const callArgs = mockResourceFromAttributes.mock.calls[0][0];
      expect(callArgs['service.version']).toBe(pkg.version);
    });

    it('sets deployment.environment', () => {
      const callArgs = mockResourceFromAttributes.mock.calls[0][0];
      expect(callArgs).toHaveProperty('deployment.environment');
      expect(typeof callArgs['deployment.environment']).toBe('string');
    });
  });

  describe('OTLP trace exporter', () => {
    it('targets localhost:4318 HTTP endpoint', () => {
      expect(mockOTLPTraceConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'http://localhost:4318/v1/traces',
        })
      );
    });
  });

  describe('OTLP log exporter', () => {
    it('targets localhost:4318 HTTP logs endpoint', () => {
      expect(mockOTLPLogConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'http://localhost:4318/v1/logs',
        })
      );
    });
  });

  describe('span processor', () => {
    it('uses SimpleSpanProcessor for immediate export', () => {
      expect(mockSimpleSpanProcessorConstructor).toHaveBeenCalled();
    });

    it('passes spanProcessors array to NodeSDK', () => {
      const config = mockNodeSDKConstructor.mock.calls[0][0];
      expect(config.spanProcessors).toHaveLength(1);
    });
  });

  describe('log record processor', () => {
    it('uses SimpleLogRecordProcessor for immediate log export', () => {
      expect(mockSimpleLogRecordProcessorConstructor).toHaveBeenCalled();
    });

    it('registers LoggerProvider globally', () => {
      expect(mockSetGlobalLoggerProvider).toHaveBeenCalledWith(
        expect.objectContaining({ shutdown: expect.any(Function) })
      );
    });
  });

  describe('pino instrumentation', () => {
    it('includes PinoInstrumentation in NodeSDK instrumentations', () => {
      const config = mockNodeSDKConstructor.mock.calls[0][0];
      expect(config.instrumentations).toHaveLength(1);
      expect(mockPinoInstrumentationConstructor).toHaveBeenCalled();
    });
  });

  describe('process.exit interception', () => {
    it('overrides process.exit to flush spans before exiting', () => {
      expect(process.exit).not.toBe(originalProcessExit);
    });
  });

  describe('SDK lifecycle', () => {
    it('starts the SDK', () => {
      expect(mockStart).toHaveBeenCalled();
    });

    it('disables auto-metrics via OTEL_METRICS_EXPORTER', () => {
      expect(process.env.OTEL_METRICS_EXPORTER).toBe('none');
    });

    it('registers SIGTERM shutdown handler', () => {
      expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    });

    it('registers SIGINT shutdown handler', () => {
      expect(processOnSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    });

    it('shutdown is idempotent (second call is a no-op)', async () => {
      const sigTermHandler = processOnSpy.mock.calls.find(([event]) => event === 'SIGTERM')[1];
      mockShutdown.mockClear();
      await sigTermHandler();
      await sigTermHandler();
      expect(mockShutdown).toHaveBeenCalledTimes(1);
    });
  });
});
