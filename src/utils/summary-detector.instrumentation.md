# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.3K
- **Output tokens**: 12.4K

## Schema Extensions
- `span.commit_story.summary.get_days_with_entries`
- `span.commit_story.summary.get_summarized_days`
- `span.commit_story.summary.find_unsummarized_days`
- `span.commit_story.summary.get_days_with_daily_summaries`
- `span.commit_story.summary.find_unsummarized_weeks`
- `span.commit_story.summary.get_summarized_weeks`
- `span.commit_story.summary.get_summarized_months`
- `span.commit_story.summary.get_weeks_with_weekly_summaries`
- `span.commit_story.summary.find_unsummarized_months`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getTodayString and getNowDate are pure synchronous utilities with no I/O — skipped (RST-001: no spans on synchronous functions; RST-004: unexported with no execution path left uncovered).
- All 9 schema-defined span names for summary detection operations (e.g., commit_story.summary.read_day_entries, commit_story.summary.read_week_daily_summaries, commit_story.summary.read_month_weekly_summaries) were already declared in use by earlier files in this run, so unique new names were invented for each function in this file and reported as schema extensions.
- The inner try/catch blocks that catch readdir errors and return empty values ([], new Set()) are graceful-degradation catches — they do not propagate errors, so recordException and setStatus were not added to them (NDS-007). The outer span-level catch handles unexpected errors with full error recording.
- All count attributes use registered keys: commit_story.summary.day_count for functions returning day collections, commit_story.summary.week_count for week collections, and commit_story.summary.month_count for month collections. No new attribute keys were invented.
- basePath is a filesystem path parameter present in every function. Since basename from node:path is not imported in this file, the raw basePath value was not used as an attribute to avoid adding non-OTel imports (CDQ-007 known limitation). The result count attributes provide sufficient diagnostic value per span.
- getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, and getWeeksWithWeeklySummaries are unexported async functions that perform file I/O and are called only from exported orchestrators — however, each is also a meaningful I/O operation in its own right. They were instrumented as COV-004 targets to provide visibility into the individual directory scans that compose the orchestrated detection logic.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):94: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):130: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):167: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):203: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):240: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):290: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):326: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):363: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):425: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
