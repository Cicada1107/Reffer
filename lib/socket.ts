//Will have to host the web socket server separately on digital ocean instead of vercel.

//This file basically creates a new response "type" that extends the default NextResponse type, but has an extra 'io' property (the socket.io server instance) 
//and the new type will not have a "body" unlike the usual http request (Nextresponse or resuest)

import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
    socket: {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};

export const config = {
    api: {
        bodyParser: false,
    },
};