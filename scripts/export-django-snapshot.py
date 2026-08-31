"""Export AbrIT Django data from SQLite without opening the source database for writes."""

from __future__ import annotations

import json
import sqlite3
import sys
from pathlib import Path


PREFIXES = ("core_", "content_", "forms_", "media_", "navigation_", "pricing_", "search_")


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: export-django-snapshot.py <sqlite-path>")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    source = Path(sys.argv[1]).resolve(strict=True)
    connection = sqlite3.connect(f"file:{source.as_posix()}?mode=ro", uri=True)
    connection.row_factory = sqlite3.Row
    try:
        names = [
            row[0]
            for row in connection.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
            if row[0].startswith(PREFIXES)
        ]
        result = {name: [dict(row) for row in connection.execute(f'SELECT * FROM "{name}"')] for name in names}
    finally:
        connection.close()
    json.dump({"source": str(source), "tables": result}, sys.stdout, ensure_ascii=False, default=str)


if __name__ == "__main__":
    main()
