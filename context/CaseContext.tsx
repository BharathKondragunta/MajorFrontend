import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { sendLocalNotification } from '../utils/notifications';
import api from '../utils/api';
import { useAuth } from './AuthContext';

// Types
export interface Evidence {
    id: string;
    evidenceId: string;
    title: string;
    type: string;
    size: string;
    date: string;
    caseId: string;
    location: string;
    hashSHA256: string;
    fileName?: string;
    filePath?: string;
    uploadedBy?: { _id: string, username: string };
    currentCustodian?: { _id: string, username: string };
}

export interface Case {
    _id: string;
    caseId: string;
    title: string;
    status: 'Active' | 'Archived';
    files: number;
    logTime: string;
    integrity: string;
    evidence: Evidence[];
}

export interface LogEntry {
    id: string;
    action: string;
    target: string;
    caseId?: string;
    timestamp: string;
    type: 'Case' | 'Evidence' | 'Profile';
    status: 'Created' | 'Secured' | 'Transferred' | 'In Review' | 'Updated';
    performedBy?: {
        username: string;
    };
}

interface CaseContextType {
    cases: Case[];
    logs: LogEntry[];
    isLoading: boolean;
    refreshData: () => Promise<void>;
    addCase: (title: string) => Promise<void>;
    addEvidence: (caseId: string, title: string, type: string, location: string, hashSHA256: string, file?: any) => Promise<void>;
    addLog: (action: string, target: string, type: 'Case' | 'Evidence' | 'Profile', status: LogEntry['status'], caseId?: string) => void;
    toggleCaseStatus: (caseId: string, currentStatus: 'Active' | 'Archived') => Promise<void>;
    getAllEvidence: () => Evidence[];
    getEvidenceById: (evidenceId: string) => Promise<Evidence | null>;
    fetchUsers: () => Promise<any[]>;
    transferEvidence: (evidenceId: string, receiverId: string, reason: string, location: string) => Promise<void>;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: ReactNode }) {
    const { session } = useAuth();
    const [cases, setCases] = useState<Case[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [allEvidence, setAllEvidence] = useState<Evidence[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshData = async () => {
        if (!session) return;
        setIsLoading(true);

        // Fetch Cases
        try {
            const casesRes = await api.get('/cases');
            if (casesRes.data.success) {
                setCases(casesRes.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch cases', error);
        }

        // Fetch Evidence (Vault)
        try {
            const evidenceRes = await api.get('/evidence');
            if (evidenceRes.data.success) {
                setAllEvidence(evidenceRes.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch evidence', error);
        }

        // Fetch Logs
        try {
            const logsRes = await api.get('/logs');
            if (logsRes.data.success) {
                setLogs(logsRes.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch logs', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, [session]);

    // ... (rest of addCase, addEvidence, etc.)

    const getAllEvidence = () => {
        return allEvidence;
    };

    const addCase = async (title: string) => {
        try {
            const caseId = `CASE-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            await api.post('/cases', { title, caseId });
            await refreshData();
            sendLocalNotification('New Case Created', `Case "${title}" has been successfully initialized.`);
        } catch (error) {
            console.error('Failed to create case', error);
            throw error;
        }
    };

    const addEvidence = async (caseId: string, title: string, type: string, location: string, hashSHA256: string, file?: any) => {
        try {
            const formData = new FormData();
            formData.append('caseId', caseId);
            formData.append('title', title);
            formData.append('type', type);
            formData.append('location', location);
            formData.append('hashSHA256', hashSHA256);

            if (file) {
                // In React Native, file object needs specific structure for FormData
                formData.append('file', {
                    uri: file.uri,
                    name: file.name || 'upload.jpg',
                    type: file.type || 'image/jpeg'
                } as any);
            }

            await api.post('/evidence', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            await refreshData();
            sendLocalNotification('Evidence Logged', `New evidence "${title}" added to case ${caseId}.`);
        } catch (error) {
            console.error('Failed to add evidence', error);
            throw error;
        }
    };

    const addLog = async (action: string, target: string, type: 'Case' | 'Evidence' | 'Profile', status: LogEntry['status'], caseId?: string) => {
        // Logging is primarily handled on the backend for forensic integrity
        // but we can optimistic update local logs if needed
        console.log('Action logged:', action, target);
    };

    const toggleCaseStatus = async (caseId: string, currentStatus: 'Active' | 'Archived') => {
        try {
            const newStatus = currentStatus === 'Active' ? 'Archived' : 'Active';
            const response = await api.put(`/cases/${caseId}/status`, { status: newStatus });

            if (response.data.success) {
                await refreshData();
                sendLocalNotification(
                    `Case ${newStatus}`,
                    `Case has been ${newStatus === 'Archived' ? 'archived' : 'unarchived'} successfully.`
                );
            }
        } catch (error) {
            console.error('Failed to toggle case status', error);
            throw error;
        }
    };
    const getEvidenceById = async (evidenceId: string) => {
        try {
            const response = await api.get(`/evidence/${evidenceId}`);
            if (response.data.success) {
                return response.data.data;
            }
            return null;
        } catch (error: any) {
            console.error('❌ Failed to fetch single evidence:', error.message || error);
            if (error.response) {
                console.error('Response Data:', error.response.data);
                console.error('Response Status:', error.response.status);
            }
            return null;
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch users', error);
            return [];
        }
    };

    const transferEvidence = async (evidenceId: string, receiverId: string, reason: string, location: string) => {
        try {
            const response = await api.put(`/evidence/${evidenceId}/transfer`, {
                receiverId,
                reason,
                location
            });

            if (response.data.success) {
                await refreshData();
                sendLocalNotification('Custody Transferred', `Evidence ${evidenceId} has been transferred successfully.`);
            }
        } catch (error) {
            console.error('Failed to transfer evidence', error);
            throw error;
        }
    };

    return (
        <CaseContext.Provider value={{
            cases, logs, isLoading, refreshData, addCase, addEvidence, addLog,
            toggleCaseStatus, getAllEvidence, getEvidenceById, fetchUsers, transferEvidence
        }}>
            {children}
        </CaseContext.Provider>
    );
}

export function useCases() {
    const context = useContext(CaseContext);
    if (context === undefined) {
        throw new Error('useCases must be used within a CaseProvider');
    }
    return context;
}
