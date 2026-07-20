# Dataset Validation Engine

The Dataset Validation Engine verifies the structural and semantic integrity of uploaded datasets before campaigns can proceed to public ingestion.

## Supported File Formats & Validation Checks

- **CSV / TSV**: Header validation, duplicate row checking, empty column analysis, quote-matching errors, line-ending formats.
- **JSON / JSONL**: Schema validation, syntax parsing, nested depth limits, missing keys, type mismatches.
- **Images (PNG, JPEG, WEBP)**: Verification of image dimensions, aspect ratio checks, MIME-type mismatch checks, corrupted pixel payload audits.
- **ZIP**: Recursive file validation, duplicate filename checking, dangerous scripts screening, path traversal detection.
- **PDF**: OCR text readability, structural rendering blocks, page counts, script attachments.
- **Plain Text**: Character set mismatch, illegal control characters, non-UTF-8 encoding alerts.

## Dataset Health Score Formula

The global Dataset Health Score $S \in [0, 100]$ is calculated dynamically based on structural integrity, completeness, and cleanliness:

$$S = 100 - \left( w_e \cdot E_{count} + w_w \cdot W_{count} + w_s \cdot S_{mismatch} \right)$$

Where:
- $E_{count}$ is the critical error count (e.g., duplicate files, schema mismatch) ($w_e = 15.0$)
- $W_{count}$ is the warning count (e.g., missing metadata, minor encoding warnings) ($w_w = 4.0$)
- $S_{mismatch}$ is the column or field missing count ($w_s = 8.0$)
- Minimum score is capped at $0$.

## Remediation Output

- **Errors (Blockers)**: Must be resolved prior to campaign publication.
- **Warnings (Non-Blockers)**: Highlights potential dataset bias or parsing edge-cases.
- **Suggestions**: Auto-generated steps (e.g., "Normalize character set to UTF-8", "Re-scale bionic image dimensions to 1024x1024").
