import Pusher from "pusher";
import PusherClient from "pusher-js";

// Server-side instance — used inside API routes to trigger events
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

// Client-side instance — used inside components to subscribe/listen
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY,
  { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER }
);

export const CHANNEL_NAME = "patient-form-channel";
export const EVENT_FIELD_UPDATE = "field-update";
export const EVENT_STATUS_UPDATE = "status-update";
