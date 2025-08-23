# Data Directory

This directory contains runtime data for the LegalCycle application.

## Structure

- `revalidation-jobs/` - Stores temporary job status files for ISR revalidation operations
  - Files are automatically created and cleaned up during revalidation processes
  - Each job gets a unique JSON file containing status, progress, and results
  - Files are temporary and should not be committed to version control

## Usage

The revalidation job system uses this persistent directory instead of `/tmp` to ensure job status is maintained across serverless function invocations on platforms like Vercel.

Files in this directory are automatically managed by:

- `/api/revalidate-optimized` - Creates and updates job files
- `/api/revalidate-status` - Reads job status from files
- Background cleanup processes (when implemented)

## Git

This directory is excluded from git via `.gitignore` since it contains temporary runtime data.
