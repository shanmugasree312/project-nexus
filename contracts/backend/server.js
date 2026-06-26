const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;
const DB_PATH = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

// Initialize flat-file repository if it does not exist
if (!fs.existsSync(DB_PATH)) {
    const initialSeedData = {
        profiles: {
            "1": {
                id: "1",
                studentName: "Alex Mercer",
                walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                metrics: {
                    problemSolving: 88,
                    consistency: 94,
                    adaptability: 82
                },
                moduleTracks: ["Advanced Data Structures", "Smart Contract Engineering", "Cognitive Computing Foundations"]
            }
        }
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialSeedData, null, 4), 'utf8');
}

/**
 * Helper to safely read metrics from local disk
 */
function readLocalDatabase() {
    try {
        const rawData = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`[Data System Error] Failed reading storage: ${error.message}`);
        return { profiles: {} };
    }
}

/**
 * Helper to safely persist records back to local disk
 */
function writeLocalDatabase(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 4), 'utf8');
        return true;
    } catch (error) {
        console.error(`[Data System Error] Failed writing storage: ${error.message}`);
        return false;
    }
}

/**
 * GET /api/nexus/profile/:id
 * Fetches targeted student educational profile and metrics.
 */
app.get('/api/nexus/profile/:id', (req, res) => {
    const profileId = req.params.id;
    console.log(`[Query Engine] Fetching data matrix for Profile ID: ${profileId}`);

    const db = readLocalDatabase();
    const profile = db.profiles[profileId];

    if (!profile) {
        return res.status(404).json({
            success: false,
            message: `Profile resource with identifier "${profileId}" not located within ledger cache.`
        });
    }

    return res.status(200).json({
        success: true,
        data: profile
    });
});

/**
 * POST /api/nexus/profile/update
 * Sanitizes input parameters, updates state, and provides state confirmation payload.
 */
app.post('/api/nexus/profile/update', (req, res) => {
    const { id, problemSolving, consistency, adaptability, moduleTracks } = req.body;

    if (!id) {
        return res.status(400).json({ success: false, message: "Missing required profile identification." });
    }

    const db = readLocalDatabase();
    if (!db.profiles[id]) {
        return res.status(404).json({ success: false, message: "Target profile does not exist." });
    }

    // Sanitize and parse numbers strictly to prevent type contamination
    const parsedProblemSolving = Math.min(100, Math.max(0, parseInt(problemSolving || 0, 10)));
    const parsedConsistency = Math.min(100, Math.max(0, parseInt(consistency || 0, 10)));
    const parsedAdaptability = Math.min(100, Math.max(0, parseInt(adaptability || 0, 10)));

    // Ensure array structure is retained for strings
    let sanitizedTracks = db.profiles[id].moduleTracks;
    if (moduleTracks && typeof moduleTracks === 'string') {
        sanitizedTracks = moduleTracks.split(',').map(track => track.trim()).filter(track => track.length > 0);
    } else if (Array.isArray(moduleTracks)) {
        sanitizedTracks = moduleTracks.map(track => String(track).trim()).filter(track => track.length > 0);
    }

    // Mutate state securely
    db.profiles[id].metrics = {
        problemSolving: parsedProblemSolving,
        consistency: parsedConsistency,
        adaptability: parsedAdaptability
    };
    db.profiles[id].moduleTracks = sanitizedTracks;

    const saveSuccess = writeLocalDatabase(db);
    if (!saveSuccess) {
        return res.status(500).json({ success: false, message: "Internal transactional disk write failure." });
    }

    console.log(`[State Transition Sync] Successfully mutated local storage profile for token context #${id}`);
    
    return res.status(200).json({
        success: true,
        message: "Cognitive metrics securely staged to local database storage vector.",
        payload: db.profiles[id]
    });
});

app.listen(PORT, () => {
    console.log(`===========================================================`);
    console.log(`Project Nexus Node Engine online: Network Listening on Port ${PORT}`);
    console.log(`Storage Registry Vector targeted at: ${DB_PATH}`);
    console.log(`===========================================================`);
});
