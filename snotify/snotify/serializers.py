from django.contrib.auth.models import User, Group
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class TrackSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=256, read_only=True)
    artist = serializers.CharField(max_length=256)
    title = serializers.CharField(max_length=256)
    url = serializers.CharField(max_length=1024, required=False)
