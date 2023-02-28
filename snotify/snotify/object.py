class Track(object):
    def __init__(self, **kwargs):
        for field in ('id', 'artist', 'title', 'url'):
            setattr(self, field, kwargs.get(field, None))

tracks = {
    1: Track(id='1', artist='Japanese Breakfast', title='Be Sweet'),
    2: Track(id='2', artist='Japanese Breakfast', title='Posing in Bondage'),
    3: Track(id='3', artist='Japanese Breakfast', title='Road Head'),
}
