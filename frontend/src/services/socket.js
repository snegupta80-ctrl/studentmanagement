import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const connectSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            withCredentials: true
        });

        socket.on('connect', () => {
            console.log('[Socket] Connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('[Socket] Disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('[Socket] Connection error:', error.message);
        });
    }
    return socket;
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

// Event listeners for student operations
export const onStudentCreated = (callback) => {
    if (socket) {
        socket.on('studentCreated', callback);
    }
};

export const onStudentUpdated = (callback) => {
    if (socket) {
        socket.on('studentUpdated', callback);
    }
};

export const onStudentDeleted = (callback) => {
    if (socket) {
        socket.on('studentDeleted', callback);
    }
};

// Remove listeners
export const offStudentCreated = (callback) => {
    if (socket) {
        socket.off('studentCreated', callback);
    }
};

export const offStudentUpdated = (callback) => {
    if (socket) {
        socket.off('studentUpdated', callback);
    }
};

export const offStudentDeleted = (callback) => {
    if (socket) {
        socket.off('studentDeleted', callback);
    }
};

export default socket;
