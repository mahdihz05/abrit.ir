from __future__ import annotations

import re
import unicodedata


ARABIC_TRANSLATION = str.maketrans({"ي": "ی", "ى": "ی", "ك": "ک", "ة": "ه", "ؤ": "و", "إ": "ا", "أ": "ا"})
DIACRITICS = re.compile(r"[\u064b-\u065f\u0670]")
WHITESPACE = re.compile(r"\s+")


def normalize_search_text(value: str) -> str:
    value = unicodedata.normalize("NFKC", value).translate(ARABIC_TRANSLATION)
    value = DIACRITICS.sub("", value)
    return WHITESPACE.sub(" ", value).strip().casefold()
