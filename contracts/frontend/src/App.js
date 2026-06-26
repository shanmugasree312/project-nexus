import React, { useState, useEffect } from 'react';

export default function App() {
    // Application core state configurations
    const [profileId, setProfileId] = useState('1');
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [serverLog, setServerLog] = useState('System initialized. Waiting for action...');

    // Administrative Form Data States
    const [formProblemSolving, setFormProblemSolving] = useState('');
    const [formConsistency, setFormConsistency] = useState('');
    const [formAdaptability, setFormAdaptability] = useState('');
    const [formModules, setFormModules] = useState('');

    // Fetch profile context logic
    const fetchStudentProfile = async (targetId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/nexus/profile/${targetId}`);
            const result = await response.json();
            
            if (result.success) {
                setStudentData(result.data);
                setFormProblemSolving(result.data.metrics.problemSolving);
                setFormConsistency(result.data.metrics.consistency);
                setFormAdaptability(result.data.metrics.adaptability);
                setFormModules(result.data.moduleTracks.join(', '));
                setServerLog(`[FETCH SUCCESS] Loaded metrics for profile identity context #${targetId}`);
            } else {
                setServerLog(`[FETCH FAILURE] Server returned operational error: ${result.message}`);
            }
        } catch (error) {
            setServerLog(`[NETWORK ERROR] Could not establish link to API Gateway: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentProfile(profileId);
    }, []);

    // Form submission processing logic
    const handleMetricsUpdateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatePayload = {
                id: profileId,
                problemSolving: formProblemSolving,
                consistency: formConsistency,
                adaptability: formAdaptability,
                moduleTracks: formModules
            };

            const response = await fetch('http://localhost:5001/api/nexus/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });

            const result = await response.json();

            if (result.success) {
                setStudentData(result.payload);
                setServerLog(`[TRANSACTION CLEARED] State local persistence synchronized successfully. Ready for chain consensus.`);
            } else {
                setServerLog(`[UPDATE REJECTED] Server rejected parameters: ${result.message}`);
            }
        } catch (error) {
            setServerLog(`[TRANSACTION CRITICAL] State sync processing exception: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Inline Theme UI Configurations
    const theme = {
        container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '40px 20px' },
        wrapper: { maxWidth: '1200px', margin: '0 auto' },
        header: { textAlign: 'center', marginBottom: '40px', borderBottom: '1px solid #334155', paddingBottom: '20px' },
        title: { fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.05em', color: '#38bdf8', margin: '0 0 10px 0' },
        subtitle: { fontSize: '1rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' },
        grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
        panel: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)', border: '1px solid #334155' },
        panelTitle: { fontSize: '1.4rem', fontWeight: '600', marginBottom: '20px', borderBottom: '2px solid #475569', paddingBottom: '8px', color: '#e2e8f0' },
        metricRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0' },
        badge: { display: 'inline-block', padding: '6px 12px', borderRadius: '20px', background: '#0284c7', color: '#fff', fontSize: '0.85rem', margin: '4px' },
        input: { width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '15px' },
        label: { display: 'block', fontSize: '0.9rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' },
        btn: { width: '100%', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' },
        terminal: { backgroundColor: '#020617', padding: '15px', borderRadius: '6px', border: '1px solid #1e293b', marginTop: '30px', fontFamily: 'monospace', color: '#4ade80', fontSize: '0.85rem' }
    };

    return (
        <div style={theme.container}>
            <div style={theme.wrapper}>
                <header style={theme.header}>
                    <h1 style={theme.title}>PROJECT NEXUS</h1>
                    <div style={theme.subtitle}>Pedagogical Streams & Cognitive-Centric Dynamic Ledgering Framework</div>
                </header>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', alignItems: 'center' }}>
                    <label style={{ color: '#94a3b8', fontWeight: '600' }}>Active Token / Profile Context Index:</label>
                    <input 
                        type="text" 
                        value={profileId} 
                        onChange={(e) => setProfileId(e.target.value)}
                        style={{ ...theme.input, width: '80px', margin: 0, textAlign: 'center' }} 
                    />
                    <button onClick={() => fetchStudentProfile(profileId)} style={{ ...theme.btn, width: '140px', padding: '10px' }}>Load Matrix</button>
                </div>

                <div style={theme.grid}>
                    {/* PANEL 1: EMPLOYER VERIFICATION PORTAL */}
                    <div style={theme.panel}>
                        <h2 style={theme.panelTitle}>Employer Verification Portal</h2>
                        {loading && <p style={{ color: '#38bdf8' }}>Synchronizing distributed components...</p>}
                        {!loading && studentData && (
                            <div>
                                <div style={{ marginBottom: '20px', borderBottom: '1px dashed #475569', paddingBottom: '15px' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Verified Target Graduate</div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>{studentData.studentName}</div>
                                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#38bdf8', marginTop: '4px' }}>SBT Target: {studentData.walletAddress}</div>
                                </div>

                                <h3 style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '10px' }}>Dynamic Cognitive Profiles</h3>
                                
                                <div style={theme.metricRow}>
                                    <span>Analytical Problem Solving</span>
                                    <strong style={{ color: '#4ade80', fontSize: '1.2rem' }}>{studentData.metrics.problemSolving} / 100</strong>
                                </div>
                                <div style={theme.metricRow}>
                                    <span>Systematic Consistency</span>
                                    <strong style={{ color: '#4ade80', fontSize: '1.2rem' }}>{studentData.metrics.consistency} / 100</strong>
                                </div>
                                <div style={theme.metricRow}>
                                    <span>Algorithmic Adaptability</span>
                                    <strong style={{ color: '#4ade80', fontSize: '1.2rem' }}>{studentData.metrics.adaptability} / 100</strong>
                                </div>

                                <h3 style={{ fontSize: '1.1rem', color: '#cbd5e1', marginTop: '25px', marginBottom: '10px' }}>Validated Module Tracks Completed</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {studentData.moduleTracks.map((track, idx) => (
                                        <span key={idx} style={theme.badge}>{track}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {!studentData && !loading && <p style={{ color: '#64748b' }}>No profile active. Trigger pipeline data pull above.</p>}
                    </div>

                    {/* PANEL 2: NGO ADMINISTRATIVE CONSOLE */}
                    <div style={theme.panel}>
                        <h2 style={theme.panelTitle}>NGO Administrative Console</h2>
                        <form onSubmit={handleMetricsUpdateSubmit}>
                            <label style={theme.label}>Analytical Problem Solving Metric (0-100)</label>
                            <input 
                                type="number" 
                                min="0" 
                                max="100" 
                                value={formProblemSolving} 
                                onChange={(e) => setFormProblemSolving(e.target.value)} 
                                style={theme.input} 
                                required 
                            />

                            <label style={theme.label}>Systematic Consistency Metric (0-100)</label>
                            <input 
                                type="number" 
                                min="0" 
                                max="100" 
                                value={formConsistency} 
                                onChange={(e) => setFormConsistency(e.target.value)} 
                                style={theme.input} 
                                required 
                            />

                            <label style={theme.label}>Algorithmic Adaptability Metric (0-100)</label>
                            <input 
                                type="number" 
                                min="0" 
                                max="100" 
                                value={formAdaptability} 
                                onChange={(e) => setFormAdaptability(e.target.value)} 
                                style={theme.input} 
                                required 
                            />

                            <label style={theme.label}>Module Tracks Completed (Comma Separated)</label>
                            <textarea 
                                value={formModules} 
                                onChange={(e) => setFormModules(e.target.value)} 
                                style={{ ...theme.input, height: '80px', resize: 'none', fontFamily: 'inherit' }} 
                                required 
                            />

                            <button type="submit" disabled={loading} style={theme.btn}>
                                {loading ? 'Committing State Update...' : 'Commit Updates to Storage'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* OPERATIONAL EVENT LOGGER */}
                <div style={theme.terminal}>
                    <div style={{ fontWeight: '700', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontSize: '0.75rem' }}>System Operational Telemetry Log</div>
                    {serverLog}
                </div>
            </div>
        </div>
    );
}
