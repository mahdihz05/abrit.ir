from django.db.models.signals import post_migrate
from django.dispatch import receiver

from .roles import provision_roles


@receiver(post_migrate)
def provision_phase1_roles(sender, using, **kwargs):
    provision_roles(using=using)
