import json
# from yt_dlp import YoutubeDL
from ytmusicapi import YTMusic
from snotify.snotify.object import Track

def search(search_term):
    yt = YTMusic()
    results = yt.search(query=search_term, filter='songs', scope=None, limit=2)
    # with open('response.json', 'w') as f:
    #     f.write(json.dumps({'results': results}, indent=4))
    # print(json.dumps({'search_term': search_term}, indent=4))
    tracks = []
    for result in results:
        if result['resultType'] == 'song':
            tracks.append(
                Track(
                    id=result['videoId'],
                    artist=result['artists'][0]['name'],
                    title=result['title'],
                )
            )
    return tracks
