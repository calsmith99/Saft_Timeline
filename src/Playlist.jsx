import React, { useEffect, useState } from 'react';
import getSpotifyAccessToken from './spotifyAuth';
import SongCard from './SongCard';
import EventCard from './EventCard';

const events = [
  { name: 'Saft 1 Start', date: '2021-06-14' },
  { name: 'Saft 1 End', date: '2021-06-17' },
  { name: 'The Royal Blue Start', date: '2022-07-30' },
  { name: 'The Royal Blue End', date: '2022-08-06' },
  { name: 'The Gnome Shack Start', date: '2023-09-22' },
  { name: 'The Gnome Shack End', date: '2023-09-30' },
  { name: 'S4FT Start', date: '2024-07-11' },
  { name: 'S4FT End', date: '2024-07-16' },
  { name: '5AFT: The \'Dam Start', date: '2025-06-04' },
  { name: '5AFT: The \'Dam End', date: '2025-06-10' },
];

const Playlist = () => {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const accessToken = await getSpotifyAccessToken();
        const playlistId = import.meta.env.VITE_SPOTIFY_PLAYLIST_ID;
        let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        const userIds = new Set();
        const allSongs = [];

        while (url) {
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch playlist data');
          }

          const data = await response.json();
          data.items.forEach((item) => {
            userIds.add(item.added_by.id);
            allSongs.push({
              name: item.track.name,
              addedAt: item.added_at,
              artist: item.track.artists.map((artist) => artist.name).join(', '),
              addedById: item.added_by.id,
              albumCover: item.track.album.images[0]?.url || '',
            });
          });

          url = data.next; // Update URL to the next page
        }

        // Fetch user profiles in bulk
        const userProfiles = await Promise.all(
          Array.from(userIds).map(async (userId) => {
            const response = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (!response.ok) {
              throw new Error('Failed to fetch user profile');
            }

            const userProfile = await response.json();
            return { id: userId, name: userProfile.display_name, imageUrl: userProfile.images?.[0]?.url || '' };
          })
        );

        const userMap = Object.fromEntries(userProfiles.map((user) => [user.id, user]));

        // Map user details back to songs
        const songsWithUsers = allSongs.map((song) => ({
          ...song,
          addedBy: userMap[song.addedById],
        }));

        setSongs(songsWithUsers.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt)));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPlaylist();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (songs.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader border-t-4 border-b-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="sticky p-4 z-50">Saft</h1>
      <div className="timelineContainer">
        <ul>
          {(() => {
            if (songs.length === 0) return <li>No songs available</li>;

            const timeline = [];
            const startDate = new Date(songs[0].addedAt);
            const endDate = new Date(songs[songs.length - 1].addedAt);

            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
              const dateString = date.toISOString().split('T')[0];
              const songsForDate = songs.filter((song) => song.addedAt.startsWith(dateString));
              const eventForDate = events.find((event) => event.date === dateString);

              if (eventForDate) {
                timeline.push(
                  <li key={`event-${dateString}`} className="flex justify-center items-center">
                    <EventCard title={eventForDate.name} description="Special Event" date={eventForDate.date} />
                  </li>
                );
              }

              if (songsForDate.length > 0) {
                songsForDate.forEach((song, index) => {
                  timeline.push(
                    <li key={`song-${dateString}-${index}`} className="flex justify-center items-center">
                      <SongCard
                        name={song.name}
                        artist={song.artist}
                        addedAt={song.addedAt}
                        addedByName={song.addedBy.name}
                        addedByImage={song.addedBy.imageUrl}
                        albumCover={song.albumCover}
                        direction={timeline.length % 2 === 0 ? 'left' : 'right'}
                      />
                    </li>
                  );
                });
              } else {
                timeline.push(
                  <li key={`line-${dateString}`}>
                    <hr style={{ width: '10%', height: '4px', margin: '20px auto', borderRadius: '4px', backgroundColor: '#ccc' }} />
                  </li>
                );
              }
            }

            return timeline;
          })()}
        </ul>
      </div>
    </div>
  );
};

export default Playlist;
