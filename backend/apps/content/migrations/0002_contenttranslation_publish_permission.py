from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [("content", "0001_initial")]

    operations = [
        migrations.AlterModelOptions(
            name="contenttranslation",
            options={
                "ordering": ("item", "locale"),
                "permissions": (("publish_contenttranslation", "Can publish and archive content translations"),),
            },
        ),
    ]
