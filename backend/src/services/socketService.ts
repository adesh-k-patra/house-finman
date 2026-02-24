import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

interface AuthSocket extends Socket {
    user?: any;
}

class SocketService {
    private io: SocketServer | null = null;

    public init(httpServer: HttpServer) {
        this.io = new SocketServer(httpServer, {
            cors: {
                origin: config.corsOrigin.split(','),
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });

        this.io.use((socket: AuthSocket, next) => {
            const token = socket.handshake.auth.token || socket.handshake.query.token;

            if (!token) {
                return next(new Error('Authentication error'));
            }

            try {
                const decoded = jwt.verify(token as string, config.jwtAccessSecret);
                socket.user = decoded;
                next();
            } catch (err) {
                next(new Error('Authentication error'));
            }
        });

        this.io.on('connection', (socket: AuthSocket) => {
            logger.info(`🔌 Socket connected: ${socket.id} (User: ${socket.user?.id})`);

            // Join user-specific room
            if (socket.user?.id) {
                socket.join(`user:${socket.user.id}`);
            }

            // Join tenant room
            if (socket.user?.tenantId) {
                socket.join(`tenant:${socket.user.tenantId}`);
            }

            socket.on('disconnect', () => {
                logger.info(`🔌 Socket disconnected: ${socket.id}`);
            });
        });

        logger.info('🚀 Socket.io initialized');
    }

    public emitToUser(userId: string, event: string, data: any) {
        if (!this.io) return;
        this.io.to(`user:${userId}`).emit(event, data);
    }

    public emitToTenant(tenantId: string, event: string, data: any) {
        if (!this.io) return;
        this.io.to(`tenant:${tenantId}`).emit(event, data);
    }

    public emitToRoom(room: string, event: string, data: any) {
        if (!this.io) return;
        this.io.to(room).emit(event, data);
    }
}

export const socketService = new SocketService();
