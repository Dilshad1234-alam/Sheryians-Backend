import React from "react";
import { useSong } from "../hooks/useSong";
import "./SongList.scss"

const SongList = () => {
  const { songs, song, setSong } = useSong();

  if (!songs?.length) return null;

  return (
    <div className="songlist">
      <h3>🎵 Songs</h3>

      {songs.map((s, i) => (
        <div
          key={i}
          className={`song-item ${song?.url === s.url ? "active" : ""}`}
          onClick={() => setSong(s)}
        >
          <img src={s.posterUrl} />
          <p>{s.title}</p>
        </div>
      ))}
    </div>
  );
};

export default SongList;