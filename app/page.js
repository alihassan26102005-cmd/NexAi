"use client";

import { useState, useRef, useEffect } from "react";
import {
  Home as HomeIcon,
  Search,
  Library,
  Plus,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Music2,
  ListMusic,
  MoreHorizontal,
  Mic2,
} from "lucide-react";

const songs = [
  {
    id: 1,
    title: "Starboy",
    artist: "The Weeknd",
    album: "Starboy",
    duration: "3:50",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:45",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "Perfect",
    artist: "Ed Sheeran",
    album: "Divide",
    duration: "4:23",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: 4,
    title: "Believer",
    artist: "Imagine Dragons",
    album: "Evolve",
    duration: "3:24",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: 5,
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "Divide",
    duration: "3:53",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: 6,
    title: "Faded",
    artist: "Alan Walker",
    album: "Different World",
    duration: "3:32",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    id: 7,
    title: "On My Way",
    artist: "Alan Walker",
    album: "Different World",
    duration: "3:13",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    id: 8,
    title: "Let Me Love You",
    artist: "DJ Snake",
    album: "Encore",
    duration: "3:25",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
];

const playlists = [
  "Liked Songs",
  "My Playlist #1",
  "Daily Mix 1",
  "Discover Weekly",
];

export default function Home() {
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState("");
  const [likedSongs, setLikedSongs] = useState([1]);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

  const song = songs[currentSong];

  // AUDIO PLAYBACK
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  // VOLUME CONTROL
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // PLAY SONG
  const playSong = (index) => {
    setCurrentSong(index);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // PLAY / PAUSE
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // NEXT SONG
  const nextSong = () => {
    let nextIndex;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);

      if (songs.length > 1 && nextIndex === currentSong) {
        nextIndex = (nextIndex + 1) % songs.length;
      }
    } else {
      nextIndex = (currentSong + 1) % songs.length;
    }

    setCurrentSong(nextIndex);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // PREVIOUS SONG
  const previousSong = () => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    setCurrentSong((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // LIKE SONG
  const toggleLike = (id) => {
    setLikedSongs((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // SEARCH
  const filteredSongs = songs.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.artist.toLowerCase().includes(search.toLowerCase())
  );

  // TIME FORMAT
  const formatTime = (time) => {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // UPDATE PROGRESS
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // LOAD AUDIO DURATION
  const loadDuration = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  // CHANGE SONG POSITION
  const changeProgress = (e) => {
    const value = Number(e.target.value);

    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  // WHEN SONG ENDS
  const handleSongEnd = () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      nextSong();
    }
  };

  // DISPLAY SONG LIST
  const displaySongs =
    activeTab === "Liked Songs"
      ? filteredSongs.filter((item) => likedSongs.includes(item.id))
      : filteredSongs;

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col overflow-hidden">

      {/* AUDIO PLAYER */}
      <audio
        ref={audioRef}
        src={song.audio}
        onTimeUpdate={updateProgress}
        onLoadedMetadata={loadDuration}
        onEnded={handleSongEnd}
      />

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 min-h-0 gap-2 p-2">

        {/* SIDEBAR */}
        <aside className="hidden md:flex w-[280px] shrink-0 flex-col gap-2">

          {/* NAVIGATION */}
          <div className="bg-[#121212] rounded-lg p-5">

            <div className="flex items-center gap-2 mb-8">
              <Music2 size={32} className="text-green-500" />
              <h1 className="text-2xl font-extrabold">Spotify</h1>
            </div>

            <button
              onClick={() => setActiveTab("Home")}
              className={`flex items-center gap-4 w-full mb-6 font-bold ${
                activeTab === "Home"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <HomeIcon size={25} />
              Home
            </button>

            <button
              onClick={() => setActiveTab("Search")}
              className={`flex items-center gap-4 w-full font-bold ${
                activeTab === "Search"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Search size={25} />
              Search
            </button>

          </div>

          {/* LIBRARY */}
          <div className="bg-[#121212] rounded-lg p-4 flex-1 overflow-y-auto">

            <div className="flex items-center justify-between mb-6">

              <button
                onClick={() => setActiveTab("Library")}
                className="flex items-center gap-3 text-gray-400 hover:text-white font-bold"
              >
                <Library size={24} />
                Your Library
              </button>

              <button className="text-gray-400 hover:text-white">
                <Plus size={23} />
              </button>

            </div>

            <div className="flex gap-2 mb-5">
              <button className="bg-[#292929] rounded-full px-4 py-2 text-sm hover:bg-[#3a3a3a]">
                Playlists
              </button>

              <button className="bg-[#292929] rounded-full px-4 py-2 text-sm hover:bg-[#3a3a3a]">
                Artists
              </button>
            </div>

            <div className="relative mb-4">
              <Search
                size={17}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search in your library"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#242424] rounded-md py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-white"
              />
            </div>

            <div className="space-y-2">

              {playlists.map((item, index) => (
                <button
                  key={item}
                  onClick={() =>
                    setActiveTab(index === 0 ? "Liked Songs" : item)
                  }
                  className="flex items-center gap-3 p-2 w-full rounded-md hover:bg-[#252525] text-left"
                >

                  <div
                    className={`w-12 h-12 rounded-md flex items-center justify-center ${
                      index === 0
                        ? "bg-gradient-to-br from-purple-700 to-blue-400"
                        : "bg-[#282828]"
                    }`}
                  >
                    {index === 0 ? (
                      <Heart size={22} fill="white" />
                    ) : (
                      <Music2 size={22} />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{item}</p>
                    <p className="text-xs text-gray-400">
                      Playlist • Spotify
                    </p>
                  </div>

                </button>
              ))}

            </div>

            <div className="mt-10 border-t border-[#282828] pt-5 text-xs text-gray-400 space-y-3">
              <p>Legal • Privacy Center • Privacy Policy</p>
              <p>Cookies • About Ads • Accessibility</p>
              <p>© 2026 Spotify Clone</p>
            </div>

          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 bg-gradient-to-b from-[#252525] via-[#181818] to-[#121212] rounded-lg overflow-y-auto">

          {/* HEADER */}
          <header className="sticky top-0 z-20 bg-[#171717]/95 backdrop-blur-md px-4 md:px-7 py-4 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <button className="bg-black/60 p-2 rounded-full hover:bg-black">
                <ChevronLeft size={20} />
              </button>

              <button className="bg-black/60 p-2 rounded-full hover:bg-black">
                <ChevronRight size={20} />
              </button>

              <div className="hidden sm:flex items-center bg-[#242424] rounded-full px-4 py-3 ml-2 w-72 focus-within:ring-2 focus-within:ring-white">

                <Search size={19} className="text-gray-400" />

                <input
                  type="text"
                  placeholder="What do you want to play?"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setActiveTab("Search");
                  }}
                  className="bg-transparent outline-none px-3 text-sm w-full"
                />

              </div>

            </div>

            <div className="flex items-center gap-3">

              <button className="hidden sm:block bg-white text-black rounded-full px-5 py-2.5 font-bold text-sm hover:scale-105 transition">
                Explore Premium
              </button>

              <button className="hidden sm:block text-gray-300 hover:text-white text-sm font-semibold">
                Install App
              </button>

              <button className="w-9 h-9 rounded-full bg-purple-700 border-4 border-black font-bold">
                A
              </button>

            </div>

          </header>

          <div className="px-4 md:px-7 pb-32">

            {/* MOBILE SEARCH */}
            <div className="sm:hidden flex items-center bg-[#242424] rounded-full px-4 py-3 mt-5">

              <Search size={19} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search songs or artists"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveTab("Search");
                }}
                className="bg-transparent outline-none px-3 text-sm w-full"
              />

            </div>

            {/* GREETING */}
            <section className="mt-7">

              <h2 className="text-2xl md:text-3xl font-extrabold mb-5">
                {activeTab === "Search"
                  ? "Search Results"
                  : activeTab === "Liked Songs"
                    ? "Liked Songs ❤️"
                    : activeTab === "Library"
                      ? "Your Library"
                      : activeTab === "Home"
                        ? "Good evening"
                        : activeTab}
              </h2>

              {activeTab === "Home" && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">

                  {songs.slice(0, 6).map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => playSong(index)}
                      className="flex items-center bg-white/10 hover:bg-white/20 rounded-md overflow-hidden group text-left transition"
                    >

                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-14 h-14 md:w-20 md:h-20 object-cover"
                      />

                      <span className="font-bold text-xs md:text-sm px-2 md:px-4 flex-1">
                        {item.title}
                      </span>

                      <span className="hidden sm:flex mr-3 bg-green-500 text-black rounded-full w-10 h-10 items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Play size={20} fill="black" />
                      </span>

                    </button>
                  ))}

                </div>
              )}

            </section>

            {/* MADE FOR YOU */}
            {activeTab === "Home" && (
              <section className="mt-10">

                <div className="flex items-center justify-between mb-5">

                  <h2 className="text-xl md:text-2xl font-bold hover:underline cursor-pointer">
                    Made For You
                  </h2>

                  <button className="text-gray-400 text-sm font-bold hover:underline">
                    Show all
                  </button>

                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">

                  {songs.slice(0, 5).map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => playSong(index)}
                      className="bg-[#181818] hover:bg-[#282828] p-3 md:p-4 rounded-lg cursor-pointer group transition"
                    >

                      <div className="relative mb-4">

                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full aspect-square object-cover rounded-md shadow-lg"
                        />

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playSong(index);
                          }}
                          className="absolute bottom-2 right-2 bg-green-500 text-black w-11 h-11 rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition hover:scale-105"
                        >
                          <Play size={22} fill="black" />
                        </button>

                      </div>

                      <h3 className="font-bold text-sm truncate mb-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-400 text-xs md:text-sm">
                        {item.artist} • {item.album}
                      </p>

                    </div>
                  ))}

                </div>

              </section>
            )}

            {/* SONGS SECTION */}
            <section className="mt-12">

              <div className="flex justify-between items-center mb-5">

                <h2 className="text-xl md:text-2xl font-bold">
                  {activeTab === "Liked Songs"
                    ? "Your Favourite Tracks"
                    : activeTab === "Search"
                      ? "Songs"
                      : "Popular Songs"}
                </h2>

                <span className="text-gray-400 text-sm">
                  {displaySongs.length} songs
                </span>

              </div>

              {/* TABLE HEADER */}
              <div className="grid grid-cols-[30px_1fr_auto] sm:grid-cols-[30px_1fr_1fr_70px] gap-3 border-b border-white/10 text-gray-400 text-xs px-3 py-3 mb-2">

                <span>#</span>
                <span>Title</span>
                <span className="hidden sm:block">Album</span>
                <span className="flex justify-end">
                  <Clock3 size={16} />
                </span>

              </div>

              {/* SONG LIST */}
              <div className="flex flex-col">

                {displaySongs.length > 0 ? (
                  displaySongs.map((item, index) => {

                    const realIndex = songs.findIndex(
                      (s) => s.id === item.id
                    );

                    const active = song.id === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => playSong(realIndex)}
                        className={`grid grid-cols-[30px_1fr_auto] sm:grid-cols-[30px_1fr_1fr_70px] gap-3 items-center px-3 py-2 rounded-md cursor-pointer group ${
                          active ? "bg-white/10" : "hover:bg-white/10"
                        }`}
                      >

                        <span className="text-sm text-gray-400">

                          {active && isPlaying ? (
                            <span className="text-green-500">♫</span>
                          ) : (
                            <>
                              <span className="group-hover:hidden">
                                {index + 1}
                              </span>

                              <Play
                                size={15}
                                className="hidden group-hover:block"
                              />
                            </>
                          )}

                        </span>

                        <div className="flex items-center gap-3 min-w-0">

                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-11 h-11 rounded object-cover"
                          />

                          <div className="min-w-0">

                            <p className={`font-medium text-sm truncate ${
                              active ? "text-green-500" : "text-white"
                            }`}>
                              {item.title}
                            </p>

                            <p className="text-xs text-gray-400 truncate">
                              {item.artist}
                            </p>

                          </div>

                        </div>

                        <span className="hidden sm:block text-gray-400 text-sm truncate">
                          {item.album}
                        </span>

                        <div className="flex items-center justify-end gap-3">

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(item.id);
                            }}
                            className={`transition ${
                              likedSongs.includes(item.id)
                                ? "text-green-500"
                                : "text-gray-400 opacity-0 group-hover:opacity-100"
                            }`}
                          >

                            <Heart
                              size={18}
                              fill={
                                likedSongs.includes(item.id)
                                  ? "currentColor"
                                  : "none"
                              }
                            />

                          </button>

                          <span className="text-gray-400 text-xs">
                            {item.duration}
                          </span>

                        </div>

                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-400">

                    <Search size={35} className="mx-auto mb-3" />

                    <p className="font-semibold">No songs found</p>

                    <p className="text-sm mt-1">
                      Try searching for another song.
                    </p>

                  </div>
                )}

              </div>

            </section>

            {/* LIKED SONGS */}
            {activeTab === "Home" && (
              <section className="mt-12">

                <h2 className="text-xl md:text-2xl font-bold mb-5">
                  Your Liked Songs ❤️
                </h2>

                <div className="flex gap-4 overflow-x-auto pb-4">

                  {songs
                    .filter((item) => likedSongs.includes(item.id))
                    .map((item) => (

                      <div
                        key={item.id}
                        onClick={() =>
                          playSong(
                            songs.findIndex((s) => s.id === item.id)
                          )
                        }
                        className="min-w-[150px] md:min-w-[180px] bg-[#181818] hover:bg-[#282828] p-3 rounded-lg cursor-pointer"
                      >

                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full aspect-square object-cover rounded-md mb-3"
                        />

                        <p className="font-bold text-sm">{item.title}</p>

                        <p className="text-gray-400 text-xs mt-1">
                          {item.artist}
                        </p>

                      </div>

                    ))}

                  {likedSongs.length === 0 && (
                    <p className="text-gray-400 text-sm">
                      You haven't liked any songs yet.
                    </p>
                  )}

                </div>

              </section>
            )}

            {/* FOOTER */}
            <footer className="border-t border-white/10 mt-14 pt-8 pb-8 text-gray-400">

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">

                <div>
                  <h3 className="text-white font-bold mb-3">Company</h3>
                  <p className="mb-2 hover:text-white cursor-pointer">About</p>
                  <p className="mb-2 hover:text-white cursor-pointer">Jobs</p>
                  <p className="hover:text-white cursor-pointer">For the Record</p>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-3">Communities</h3>
                  <p className="mb-2 hover:text-white cursor-pointer">For Artists</p>
                  <p className="mb-2 hover:text-white cursor-pointer">Developers</p>
                  <p className="hover:text-white cursor-pointer">Advertising</p>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-3">Useful Links</h3>
                  <p className="mb-2 hover:text-white cursor-pointer">Support</p>
                  <p className="hover:text-white cursor-pointer">Free Mobile App</p>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-3">Spotify Plans</h3>
                  <p className="mb-2 hover:text-white cursor-pointer">Premium</p>
                  <p className="hover:text-white cursor-pointer">Free</p>
                </div>

              </div>

              <p className="text-xs mt-12">
                © 2026 Spotify Clone. Created for learning purposes.
              </p>

            </footer>

          </div>

        </main>

      </div>

      {/* BOTTOM MUSIC PLAYER */}
      <footer className="h-[85px] md:h-[90px] bg-black border-t border-[#282828] flex items-center justify-between px-3 md:px-5 gap-3 shrink-0">

        {/* CURRENT SONG */}
        <div className="flex items-center gap-3 w-[35%] md:w-[30%] min-w-0">

          <img
            src={song.image}
            alt={song.title}
            className="w-12 h-12 md:w-14 md:h-14 rounded object-cover"
          />

          <div className="min-w-0">

            <p className="font-semibold text-xs md:text-sm truncate">
              {song.title}
            </p>

            <p className="text-gray-400 text-[10px] md:text-xs truncate">
              {song.artist}
            </p>

          </div>

          <button
            onClick={() => toggleLike(song.id)}
            className={`hidden sm:block ${
              likedSongs.includes(song.id)
                ? "text-green-500"
                : "text-gray-400 hover:text-white"
            }`}
          >

            <Heart
              size={18}
              fill={
                likedSongs.includes(song.id)
                  ? "currentColor"
                  : "none"
              }
            />

          </button>

        </div>

        {/* PLAYER CONTROLS */}
        <div className="flex flex-col items-center flex-1 max-w-[600px]">

          <div className="flex items-center justify-center gap-3 md:gap-6 mb-2">

            <button
              onClick={() => setShuffle(!shuffle)}
              className={`hidden sm:block ${
                shuffle ? "text-green-500" : "text-gray-400 hover:text-white"
              }`}
              title="Shuffle"
            >
              <Shuffle size={17} />
            </button>

            <button
              onClick={previousSong}
              className="text-gray-300 hover:text-white"
              title="Previous"
            >
              <SkipBack size={19} fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              className="bg-white text-black rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:scale-105 transition"
              title={isPlaying ? "Pause" : "Play"}
            >

              {isPlaying ? (
                <Pause size={19} fill="black" />
              ) : (
                <Play size={19} fill="black" />
              )}

            </button>

            <button
              onClick={nextSong}
              className="text-gray-300 hover:text-white"
              title="Next"
            >
              <SkipForward size={19} fill="currentColor" />
            </button>

            <button
              onClick={() => setRepeat(!repeat)}
              className={`hidden sm:block ${
                repeat ? "text-green-500" : "text-gray-400 hover:text-white"
              }`}
              title="Repeat"
            >
              <Repeat size={17} />
            </button>

          </div>

          {/* PROGRESS BAR */}
          <div className="hidden sm:flex items-center gap-2 w-full">

            <span className="text-[10px] text-gray-400 w-9 text-right">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 100}
              value={Math.min(currentTime, duration || 100)}
              onChange={changeProgress}
              className="w-full h-1 accent-white cursor-pointer hover:accent-green-500"
            />

            <span className="text-[10px] text-gray-400 w-9">
              {formatTime(duration)}
            </span>

          </div>

        </div>

        {/* VOLUME */}
        <div className="hidden md:flex items-center justify-end gap-3 w-[30%]">

          <button className="text-gray-400 hover:text-white">
            <ListMusic size={18} />
          </button>

          <button className="text-gray-400 hover:text-white">
            <Mic2 size={18} />
          </button>

          <button
            onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            className="text-gray-400 hover:text-white"
          >

            {volume === 0 ? (
              <VolumeX size={19} />
            ) : (
              <Volume2 size={19} />
            )}

          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-white hover:accent-green-500 cursor-pointer"
          />

          <button className="text-gray-400 hover:text-white">
            <MoreHorizontal size={20} />
          </button>

        </div>

        {/* MOBILE PROGRESS */}
        <div
          className="absolute bottom-[85px] left-0 h-[2px] bg-green-500 sm:hidden"
          style={{
            width: `${duration ? (currentTime / duration) * 100 : 0}%`,
          }}
        />

      </footer>

    </div>
  );
}