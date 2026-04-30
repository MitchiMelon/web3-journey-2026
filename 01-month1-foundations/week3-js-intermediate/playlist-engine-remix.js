const playlists = [
  [
    {
      trackId: "trk101",
      artist: "Velvet Comet",
      title: "Crimson Afterglow",
      votes: 5,
      bpm: 122
    },
    {
      trackId: "trk102",
      artist: "Neon Harbor",
      title: "Static Horizon",
      votes: 2,
      bpm: 108
    },
    {
      trackId: "trk103",
      artist: "Lunar Arcade",
      title: "Midnight Frequency",
      votes: 4,
      bpm: 128
    }
  ],
  [
    {
      trackId: "trk201",
      artist: "Solar Echo",
      title: "Glass Skyline",
      votes: 3,
      bpm: 115
    },
    {
      trackId: "trk202",
      artist: "Velvet Comet",
      title: "Satellite Hearts",
      votes: 6,
      bpm: 124
    }
  ]
];


function flattenPlaylists(arr) {
  if (!Array.isArray(arr)) return [];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const playlist = arr[i];
    if (!Array.isArray(playlist)) continue;
    for (let j = 0; j < playlist.length; j++) {
      const track = playlist[j];
      result.push({
        ...track,
        source: [i, j]
      });
    }
  }
  return result;
}


function scoreTracks(tracks) {
  return tracks.map(track => ({
    ...track,
    score: track.votes * 10 - Math.abs(track.bpm - 120)
  }));
}


function dedupeTracks(tracks) {
  const seen = new Set();
  return tracks.filter(track => {
    if (seen.has(track.trackId)) return false;
    seen.add(track.trackId);
    return true;
  });
}


function enforceArtistQuota(tracks, maxPerArtist) {
  const artistCount = {};
  return tracks.filter(track => {
    const artist = track.artist;
    const current = artistCount[artist] || 0;
    if (current < maxPerArtist) {
      artistCount[artist] = current + 1;
      return true;
    }
    return false;
  });
}


function buildSchedule(tracks) {
  return tracks.map((track, index) => ({
    slot: index + 1,
    trackId: track.trackId
  }));
}


function remixPlaylist(playlists, maxPerArtist) {
  return buildSchedule(
    enforceArtistQuota(
      dedupeTracks(
        scoreTracks(
          flattenPlaylists(playlists)
        )
      ),
      maxPerArtist
    )
  );
}
