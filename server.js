// ============================================================
// MFLIX BACKEND
// Render + Mux + TMDB
// ============================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 10000;

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// ------------------------------------------------------------
// Middleware
// ------------------------------------------------------------

app.use(cors());

app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
    res.json({
        status: "online",
        app: "MFLIX",
        service: "Render + Mux + TMDB",
        time: new Date().toISOString()
    });
});

// ------------------------------------------------------------
// Temporary movie storage
// ------------------------------------------------------------

const movies = [
    {
        id: "mflix-demo-1",

        title: "MFLIX Demo Movie",

        description:
            "This is a demonstration movie used to test the MFLIX player.",

        category: "Most Popular",

        year: 2026,

        poster:
            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",

        rating: 8.2,

        cast: [],

        tmdbId: null,

        muxPlaybackId:
            "7hytGSu02qUMD7U7XdZaaXkeUSfj746ri46Ny1DqJiRk",

        playbackId:
            "7hytGSu02qUMD7U7XdZaaXkeUSfj746ri46Ny1DqJiRk",

        status: "ready",

        // Existing movie may not have MP4 support enabled.
        downloadUrl: null
    }
];

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function muxAuthHeader() {

    if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
        throw new Error(
            "MUX_TOKEN_ID or MUX_TOKEN_SECRET is missing"
        );
    }

    const encoded = Buffer.from(
        `${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`
    ).toString("base64");

    return `Basic ${encoded}`;
}

function createId() {
    return crypto.randomUUID();
}


// Create Mux MP4 URL.
//
// IMPORTANT:
// This works when the Mux asset has MP4 support enabled.
// New uploads created by this backend request standard MP4
// support automatically.
function createMuxDownloadUrl(playbackId) {

    if (!playbackId) {
        return null;
    }

    return `https://stream.mux.com/${encodeURIComponent(
        playbackId
    )}/high.mp4`;
}


function cleanMovie(movie) {

    const playbackId =
        movie.muxPlaybackId ||
        movie.playbackId ||
        null;

    return {

        id: movie.id,

        title:
            movie.title || "",

        description:
            movie.description || "",

        poster:
            movie.poster || "",

        category:
            movie.category || "Most Popular",

        year:
            movie.year || "",

        rating:
            movie.rating || null,

        cast:
            movie.cast || [],

        tmdbId:
            movie.tmdbId || null,

        muxPlaybackId:
            movie.muxPlaybackId ||
            movie.playbackId ||
            null,

        playbackId:
            movie.playbackId ||
            movie.muxPlaybackId ||
            null,

        status:
            movie.status || "ready",

        downloadUrl:
            movie.downloadUrl ||
            null
    };
}

// ------------------------------------------------------------
// MOVIES
// ------------------------------------------------------------

app.get("/api/movies", (req, res) => {

    res.json(
        movies.map(cleanMovie)
    );

});


app.get("/api/movies/:id", (req, res) => {

    const movie =
        movies.find(
            item => item.id === req.params.id
        );

    if (!movie) {

        return res.status(404).json({
            error: "Movie not found"
        });

    }

    res.json(
        cleanMovie(movie)
    );

});

// ------------------------------------------------------------
// TMDB SEARCH
// ------------------------------------------------------------

app.get("/api/tmdb/search", async (req, res) => {

    try {

        if (!TMDB_API_KEY) {

            return res.status(500).json({
                error:
                    "TMDB_API_KEY is not configured on Render"
            });

        }

        const query =
            String(
                req.query.query || ""
            ).trim();

        if (!query) {

            return res.status(400).json({
                error: "Missing query"
            });

        }

        const url =
            "https://api.themoviedb.org/3/search/multi" +
            `?api_key=${encodeURIComponent(TMDB_API_KEY)}` +
            `&query=${encodeURIComponent(query)}` +
            "&include_adult=false";

        const response =
            await fetch(url);

        if (!response.ok) {

            const body =
                await response.text();

            return res.status(
                response.status
            ).json({
                error:
                    "TMDB request failed",
                details: body
            });

        }

        const data =
            await response.json();

        const results =
            (data.results || [])
                .filter(item =>
                    item.media_type === "movie" ||
                    item.media_type === "tv"
                )
                .map(item => ({

                    id: item.id,

                    mediaType:
                        item.media_type,

                    title:
                        item.title ||
                        item.name ||
                        "",

                    description:
                        item.overview ||
                        "",

                    releaseDate:
                        item.release_date ||
                        item.first_air_date ||
                        "",

                    year:
                        (
                            item.release_date ||
                            item.first_air_date ||
                            ""
                        ).slice(0, 4),

                    rating:
                        item.vote_average || 0,

                    poster:
                        item.poster_path
                            ? `https://image.tmdb.org/t/p/w780${item.poster_path}`
                            : "",

                    backdrop:
                        item.backdrop_path
                            ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
                            : ""

                }));

        res.json({
            results
        });

    } catch (error) {

        console.error(
            "TMDB search error:",
            error
        );

        res.status(500).json({
            error:
                "TMDB search failed"
        });

    }

});

// ------------------------------------------------------------
// TMDB MOVIE DETAILS
// ------------------------------------------------------------

app.get("/api/tmdb/movie/:id", async (req, res) => {

    try {

        if (!TMDB_API_KEY) {

            return res.status(500).json({
                error:
                    "TMDB_API_KEY is not configured"
            });

        }

        const tmdbId =
            encodeURIComponent(
                req.params.id
            );

        const url =
            `https://api.themoviedb.org/3/movie/${tmdbId}` +
            `?api_key=${encodeURIComponent(TMDB_API_KEY)}` +
            "&append_to_response=credits";

        const response =
            await fetch(url);

        if (!response.ok) {

            const body =
                await response.text();

            return res.status(
                response.status
            ).json({
                error:
                    "TMDB movie request failed",
                details: body
            });

        }

        const data =
            await response.json();

        const cast =
            (data.credits?.cast || [])
                .slice(0, 12)
                .map(person => ({

                    id: person.id,

                    name: person.name,

                    character:
                        person.character,

                    profile:
                        person.profile_path
                            ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                            : ""

                }));

        res.json({

            id: data.id,

            title:
                data.title,

            description:
                data.overview || "",

            releaseDate:
                data.release_date || "",

            year:
                (
                    data.release_date || ""
                ).slice(0, 4),

            rating:
                data.vote_average || 0,

            poster:
                data.poster_path
                    ? `https://image.tmdb.org/t/p/w780${data.poster_path}`
                    : "",

            backdrop:
                data.backdrop_path
                    ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
                    : "",

            genres:
                (data.genres || [])
                    .map(
                        genre => genre.name
                    ),

            cast

        });

    } catch (error) {

        console.error(
            "TMDB details error:",
            error
        );

        res.status(500).json({
            error:
                "TMDB details request failed"
        });

    }

});

// ------------------------------------------------------------
// MUX DIRECT UPLOAD
// ------------------------------------------------------------

app.post(
    "/api/mux/direct-upload",
    async (req, res) => {

        try {

            if (
                !MUX_TOKEN_ID ||
                !MUX_TOKEN_SECRET
            ) {

                return res.status(500).json({
                    error:
                        "Mux credentials are not configured on Render"
                });

            }

            const response =
                await fetch(
                    "https://api.mux.com/video/v1/uploads",
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                muxAuthHeader(),

                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                new_asset_settings: {

                                    // Public streaming
                                    playback_policy:
                                        ["public"],

                                    // IMPORTANT:
                                    // Generate an MP4 rendition
                                    // for offline downloading.
                                    mp4_support:
                                        "standard",

                                    video_quality:
                                        "basic"
                                },

                                cors_origin:
                                    "*"
                            })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                console.error(
                    "Mux upload creation failed:",
                    data
                );

                return res.status(
                    response.status
                ).json({

                    error:
                        "Unable to create Mux upload",

                    details:
                        data

                });

            }

            res.json({

                uploadId:
                    data.data.id,

                uploadUrl:
                    data.data.url,

                status:
                    data.data.status

            });

        } catch (error) {

            console.error(
                "Mux direct upload error:",
                error
            );

            res.status(500).json({
                error:
                    "Mux direct upload failed"
            });

        }

    }
);

// ------------------------------------------------------------
// CHECK MUX UPLOAD
// ------------------------------------------------------------

app.get(
    "/api/mux/upload/:uploadId",
    async (req, res) => {

        try {

            const uploadId =
                encodeURIComponent(
                    req.params.uploadId
                );

            const response =
                await fetch(
                    `https://api.mux.com/video/v1/uploads/${uploadId}`,
                    {
                        headers: {
                            Authorization:
                                muxAuthHeader()
                        }
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                return res.status(
                    response.status
                ).json({

                    error:
                        "Unable to check Mux upload",

                    details:
                        data

                });

            }

            res.json(data);

        } catch (error) {

            console.error(
                "Mux upload status error:",
                error
            );

            res.status(500).json({
                error:
                    "Mux upload status check failed"
            });

        }

    }
);

// ------------------------------------------------------------
// MUX ASSET
// ------------------------------------------------------------

app.get(
    "/api/mux/asset/:assetId",
    async (req, res) => {

        try {

            const assetId =
                encodeURIComponent(
                    req.params.assetId
                );

            const response =
                await fetch(
                    `https://api.mux.com/video/v1/assets/${assetId}`,
                    {
                        headers: {
                            Authorization:
                                muxAuthHeader()
                        }
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                return res.status(
                    response.status
                ).json({

                    error:
                        "Unable to retrieve Mux asset",

                    details:
                        data

                });

            }

            res.json(data);

        } catch (error) {

            console.error(
                "Mux asset error:",
                error
            );

            res.status(500).json({
                error:
                    "Mux asset request failed"
            });

        }

    }
);

// ------------------------------------------------------------
// CREATE MOVIE
// ------------------------------------------------------------

app.post(
    "/api/movies",
    async (req, res) => {

        try {

            const {
                title,
                description,
                category,
                year,
                poster,
                tmdbId,
                muxPlaybackId,
                rating,
                cast
            } = req.body;

            if (!title) {

                return res.status(400).json({
                    error:
                        "Movie title is required"
                });

            }

            if (!muxPlaybackId) {

                return res.status(400).json({
                    error:
                        "Mux playback ID is required"
                });

            }

            const movie = {

                id:
                    createId(),

                title:
                    String(title).trim(),

                description:
                    String(
                        description || ""
                    ).trim(),

                category:
                    String(
                        category ||
                        "Most Popular"
                    ),

                year:
                    year || "",

                poster:
                    poster || "",

                tmdbId:
                    tmdbId || null,

                rating:
                    rating || null,

                cast:
                    Array.isArray(cast)
                        ? cast
                        : [],

                muxPlaybackId:
                    String(
                        muxPlaybackId
                    ),

                playbackId:
                    String(
                        muxPlaybackId
                    ),

                status:
                    "ready",

                // MP4 URL for offline download.
                //
                // This requires the Mux asset to have
                // MP4 support enabled.
                downloadUrl:
                    createMuxDownloadUrl(
                        muxPlaybackId
                    ),

                createdAt:
                    new Date().toISOString()

            };

            movies.unshift(movie);

            res.status(201).json({

                success:
                    true,

                movie:
                    cleanMovie(movie)

            });

        } catch (error) {

            console.error(
                "Create movie error:",
                error
            );

            res.status(500).json({
                error:
                    "Unable to create movie"
            });

        }

    }
);

// ------------------------------------------------------------
// DOWNLOAD INFORMATION
// ------------------------------------------------------------

app.get(
    "/api/movies/:id/download",
    async (req, res) => {

        try {

            const movie =
                movies.find(
                    item =>
                        item.id ===
                        req.params.id
                );

            if (!movie) {

                return res.status(404).json({
                    error:
                        "Movie not found"
                });

            }

            const playbackId =
                movie.muxPlaybackId ||
                movie.playbackId;

            if (!playbackId) {

                return res.status(404).json({
                    error:
                        "Movie has no Mux playback ID"
                });

            }

            const downloadUrl =
                movie.downloadUrl ||
                createMuxDownloadUrl(
                    playbackId
                );

            res.json({

                success:
                    true,

                movieId:
                    movie.id,

                title:
                    movie.title,

                downloadUrl

            });

        } catch (error) {

            console.error(
                "Download URL error:",
                error
            );

            res.status(500).json({
                error:
                    "Unable to create download URL"
            });

        }

    }
);

// ------------------------------------------------------------
// UPLOAD COMPATIBILITY ROUTE
// ------------------------------------------------------------

app.post(
    "/api/movies/upload",
    async (req, res) 
