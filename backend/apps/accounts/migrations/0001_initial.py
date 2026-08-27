from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name="AdminCapability",
            fields=[("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID"))],
            options={
                "managed": False,
                "default_permissions": (),
                "permissions": (
                    ("access_admin", "Can access the administration surfaces"),
                    ("view_dashboard", "Can view the administration dashboard"),
                    ("view_role_catalog", "Can view the fixed role catalog"),
                ),
            },
        ),
    ]
