# Instrumentation Report: src/generators/journal-graph.js

## Summary
- **Status**: success
- **Spans added**: 4
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 64.9K
- **Output tokens**: 90.3K
- **Cached tokens**: 95.5K

## Schema Extensions
- `span.commit_story.ai.generate_summary`
- `span.commit_story.ai.generate_technical_decisions`
- `commit_story.ai.substantial_messages_count`
- `span.commit_story.ai.generate_dialogue`
- `commit_story.ai.max_quotes`
- `span.commit_story.ai.generate_journal_sections`
- `commit_story.journal.errors_count`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| analyzeCommitContent | instrumented | 0 |
| generateImplementationGuidance | instrumented | 0 |
| formatSessionsForAI | instrumented | 0 |
| formatContextForSummary | instrumented | 0 |
| formatContextForUser | instrumented | 0 |
| cleanDialogueOutput | instrumented | 0 |
| cleanTechnicalOutput | instrumented | 0 |
| cleanSummaryOutput | instrumented | 0 |
| summaryNode | instrumented | 1 |
| technicalNode | instrumented | 1 |
| dialogueNode | instrumented | 1 |
| generateJournalSections | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 1 blocking error (NDS-003 (Code Preserved):1)
2. **Attempt 2**: 3 blocking errors (NDS-003 (Code Preserved):3)
3. **Attempt 3**: 46 blocking errors (NDS-003 (Code Preserved):43, NDS-005 (Control Flow Preserved):2, NDS-007 (Expected Catch Unmodified):1)
4. **Attempt 4**: function-level: 12/12 functions instrumented

## Notes
- Function-level fallback: 12/12 functions instrumented
-   instrumented: analyzeCommitContent (0 spans)
-   instrumented: generateImplementationGuidance (0 spans)
-   instrumented: formatSessionsForAI (0 spans)
-   instrumented: formatContextForSummary (0 spans)
-   instrumented: formatContextForUser (0 spans)
-   instrumented: cleanDialogueOutput (0 spans)
-   instrumented: cleanTechnicalOutput (0 spans)
-   instrumented: cleanSummaryOutput (0 spans)
-   instrumented: summaryNode (1 spans)
-   instrumented: technicalNode (1 spans)
-   instrumented: dialogueNode (1 spans)
-   instrumented: generateJournalSections (1 spans)

## Advisory Findings
- CDQ-007 (Attribute Data Quality):464: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):525: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):599: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
