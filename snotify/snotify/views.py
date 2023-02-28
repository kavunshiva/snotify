from django.contrib.auth.models import User, Group
from rest_framework import decorators, viewsets, permissions, response, status
from rest_framework.decorators import api_view
from snotify.snotify.serializers import UserSerializer, GroupSerializer, TrackSerializer
from snotify.snotify.utils import search as search_util
from snotify.snotify.object import Track, tracks
import yt_dlp


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class TrackViewSet(viewsets.ViewSet):
    def list(self, request):
        serializer = TrackSerializer(
            instance=tracks.values(), many=True)
        return response.Response(serializer.data)

    def retrieve(self, request, pk=None):
        url = f'https://www.youtube.com/watch?v={pk}'

        ydl_opts = {
            'format': 'm4a/bestaudio/best',
            # ℹ️ See help(yt_dlp.postprocessor) for a list of available Postprocessors and their arguments
            'postprocessors': [{  # Extract audio using ffmpeg
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'm4a',
            }]
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            song_info = ydl.extract_info(url, download=False)

        track = Track(
            id=pk,
            artist=song_info['artist'],
            title=song_info['track'],
            url=song_info['url'],
        )

        serializer = TrackSerializer(instance=track)
        # return response.Response(serializer.data)
        return response.Response(serializer.data)


@api_view()
def search(request):
    results = search_util(request.GET['q'])
    serializer = TrackSerializer(instance=results, many=True)
    return response.Response(
        data=serializer.data,
        status=status.HTTP_200_OK,
        content_type='application/json',
    )
