from __future__ import annotations

from jsonschema import Draft202012Validator


BASE_OBJECT = {"type": "object", "additionalProperties": False}
DEFINITIONS = {
    "link": {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "label": {"type": "string", "maxLength": 80},
            "url": {"type": "string", "maxLength": 500},
        },
        "required": ["label", "url"],
    },
    "card": {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "title": {"type": "string", "maxLength": 160},
            "body": {"type": "string", "maxLength": 1000},
            "label": {"type": "string", "maxLength": 80},
        },
        "required": ["title", "body"],
    },
    "stat": {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "value": {"type": "string", "maxLength": 60},
            "label": {"type": "string", "maxLength": 120},
        },
        "required": ["value", "label"],
    },
    "faq": {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "question": {"type": "string", "maxLength": 300},
            "answer": {"type": "string", "maxLength": 3000},
        },
        "required": ["question", "answer"],
    },
}

BLOCK_SCHEMAS: dict[str, dict] = {
    "hero": {
        **BASE_OBJECT,
        "properties": {
            "eyebrow": {"type": "string", "maxLength": 100},
            "title": {"type": "string", "minLength": 1, "maxLength": 180},
            "highlight": {"type": "string", "maxLength": 80},
            "body": {"type": "string", "maxLength": 800},
            "primary_cta": {"$ref": "#/$defs/link"},
            "secondary_cta": {"$ref": "#/$defs/link"},
            "points": {"type": "array", "items": {"type": "string", "maxLength": 120}, "maxItems": 6},
        },
        "required": ["title"],
    },
    "rich_text": {
        **BASE_OBJECT,
        "properties": {"html": {"type": "string", "maxLength": 50000}},
        "required": ["html"],
    },
    "feature_grid": {
        **BASE_OBJECT,
        "properties": {
            "eyebrow": {"type": "string", "maxLength": 100},
            "title": {"type": "string", "maxLength": 180},
            "body": {"type": "string", "maxLength": 800},
            "items": {"type": "array", "items": {"$ref": "#/$defs/card"}, "minItems": 1, "maxItems": 12},
        },
        "required": ["title", "items"],
    },
    "service_grid": {
        **BASE_OBJECT,
        "properties": {
            "eyebrow": {"type": "string", "maxLength": 100},
            "title": {"type": "string", "maxLength": 180},
            "body": {"type": "string", "maxLength": 800},
            "limit": {"type": "integer", "minimum": 1, "maximum": 20},
        },
        "required": ["title"],
    },
    "stats": {
        **BASE_OBJECT,
        "properties": {
            "title": {"type": "string", "maxLength": 180},
            "items": {"type": "array", "items": {"$ref": "#/$defs/stat"}, "minItems": 1, "maxItems": 8},
        },
        "required": ["items"],
    },
    "steps": {
        **BASE_OBJECT,
        "properties": {
            "title": {"type": "string", "maxLength": 180},
            "body": {"type": "string", "maxLength": 800},
            "items": {"type": "array", "items": {"$ref": "#/$defs/card"}, "minItems": 1, "maxItems": 8},
        },
        "required": ["title", "items"],
    },
    "faq": {
        **BASE_OBJECT,
        "properties": {
            "title": {"type": "string", "maxLength": 180},
            "body": {"type": "string", "maxLength": 800},
            "items": {"type": "array", "items": {"$ref": "#/$defs/faq"}, "minItems": 1, "maxItems": 30},
        },
        "required": ["title", "items"],
    },
    "cta": {
        **BASE_OBJECT,
        "properties": {
            "title": {"type": "string", "maxLength": 180},
            "body": {"type": "string", "maxLength": 800},
            "primary_cta": {"$ref": "#/$defs/link"},
            "secondary_cta": {"$ref": "#/$defs/link"},
        },
        "required": ["title", "primary_cta"],
    },
    "pricing": {**BASE_OBJECT, "properties": {"title": {"type": "string", "maxLength": 180}}},
    "network_visual": {
        **BASE_OBJECT,
        "properties": {
            "eyebrow": {"type": "string", "maxLength": 100},
            "title": {"type": "string", "maxLength": 180},
            "body": {"type": "string", "maxLength": 1000},
            "notice": {"type": "string", "maxLength": 500},
            "items": {"type": "array", "items": {"$ref": "#/$defs/card"}, "maxItems": 8},
        },
        "required": ["title", "notice"],
    },
}


def validate_block_props(block_type: str, props: dict) -> list[str]:
    schema = BLOCK_SCHEMAS.get(block_type)
    if schema is None:
        return [f"Unknown block type: {block_type}"]
    validator = Draft202012Validator({**schema, "$defs": DEFINITIONS})
    return [error.message for error in sorted(validator.iter_errors(props), key=lambda item: list(item.path))]
