import { NextResponse } from "next/server";
import { tasks } from "@trigger.dev/sdk/v3";
import type { syncResourcesTask } from "@/trigger/sync-resources";

export const POST = async () => {
  try {
    // Trigger the scheduled sync task manually
    const handle = await tasks.trigger<typeof syncResourcesTask>(
      "sync-resources",
      {
        type: "IMPERATIVE",
        timestamp: new Date(),
        lastTimestamp: undefined,
        timezone: "UTC",
        scheduleId: "manual-trigger",
        externalId: "api-route",
        upcoming: [],
      }
    );

    return NextResponse.json({
      success: true,
      message: "Sync task triggered successfully",
      taskId: handle.id,
    });
  } catch (error) {
    console.error("Failed to trigger sync task:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to trigger sync task",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
