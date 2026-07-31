import { pusherServer, CHANNEL_NAME } from "@/lib/pusher";

export async function POST(req) {
  try {
    const { event, data } = await req.json();
    await pusherServer.trigger(CHANNEL_NAME, event, data);
    return Response.json({ success: true });
  } catch (err) {
    console.error("Pusher trigger error:", err);
    return Response.json({ success: false }, { status: 500 });
  }
}
