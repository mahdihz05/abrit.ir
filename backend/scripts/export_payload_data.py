"""Export the Django CMS records needed by the Payload migration.

Run this with the legacy Django environment, not with the Payload application.
The resulting JSON contains no passwords or Django user records.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

import django  # noqa: E402

django.setup()

from django.core.management import call_command  # noqa: E402


MODELS = (
    "core.sitesettings",
    "core.sitesettingstranslation",
    "core.designsettings",
    "content.contentitem",
    "content.contenttranslation",
    "content.contentblock",
    "content.contentrelation",
    "content.capability",
    "content.capabilitytranslation",
    "content.technology",
    "content.serviceprofile",
    "content.taxonomyterm",
    "content.taxonomytranslation",
    "content.articleprofile",
    "pricing.package",
    "pricing.packagetranslation",
    "pricing.packagefeature",
    "pricing.packagefeaturetranslation",
    "pricing.packagefeaturevalue",
    "pricing.addonrate",
    "pricing.contractterm",
    "forms.form",
    "forms.formtranslation",
    "forms.formfield",
    "forms.formfieldtranslation",
    "navigation.menu",
    "navigation.menuitem",
    "navigation.menuitemtranslation",
)


def main() -> None:
    destination = Path(sys.argv[1] if len(sys.argv) > 1 else "payload-legacy-export.json")
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("w", encoding="utf-8") as handle:
        call_command("dumpdata", *MODELS, indent=2, natural_foreign=True, stdout=handle)
    # Parse once so a partial dump cannot be accidentally deployed.
    with destination.open(encoding="utf-8") as handle:
        json.load(handle)
    print(f"Payload migration export written to {destination}")


if __name__ == "__main__":
    main()
