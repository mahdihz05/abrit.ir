from django.urls import path

from .user_api import UserActivateView, UserCollectionView, UserDeactivateView, UserDetailView, UserPasswordView


urlpatterns = [
    path("users", UserCollectionView.as_view(), name="admin-user-list-create"),
    path("users/<int:user_id>", UserDetailView.as_view(), name="admin-user-detail"),
    path("users/<int:user_id>/password", UserPasswordView.as_view(), name="admin-user-password"),
    path("users/<int:user_id>/activate", UserActivateView.as_view(), name="admin-user-activate"),
    path("users/<int:user_id>/deactivate", UserDeactivateView.as_view(), name="admin-user-deactivate"),
]
