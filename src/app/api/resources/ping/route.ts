import { listResources } from '@/services/db/resources';

import { parseX402Response } from '@/lib/x402/schema';
import { checkCronSecret } from '@/lib/cron';
import { NextResponse, type NextRequest } from 'next/server';
import { upsertResourceResponse } from '@/services/db/resource-responses';

export const GET = async (request: NextRequest) => {
  const cronCheck = checkCronSecret(request);
  if (cronCheck) {
    return cronCheck;
  }

  const startTime = Date.now();
  console.info('Starting resource ping task', {
    timestamp: new Date().toISOString(),
    lastTimestamp: new Date().toISOString(),
    scheduleId: 'ping-resources',
  });

  try {
    // Step 1: Fetch all resources from database
    console.info('Fetching all resources from database');
    const resources = await listResources();
    console.info('Successfully fetched resources', {
      totalResources: resources.length,
      durationMs: Date.now() - startTime,
    });

    if (resources.length === 0) {
      console.warn('No resources found in database');
      return {
        success: true,
        message: 'No resources to ping',
        resourcesPinged: 0,
        durationMs: Date.now() - startTime,
      };
    }

    // Step 2: Ping all resources and store responses
    console.info('Starting resource ping processing');

    const pingResults = await Promise.allSettled(
      resources.map(async resource => {
        for (const method of ['GET', 'POST']) {
          console.info('pinging resource', {
            method,
          });
          const response = await fetch(resource.resource, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const status = response.status;

          if (status === 402) {
            try {
              const parsedResponse = parseX402Response(await response.json());
              if (parsedResponse.success) {
                console.info('resource responded with valid x402 response', {
                  resource: resource.resource,
                  status,
                });
                await upsertResourceResponse(resource.id, parsedResponse.data);
                return {
                  resource: resource.resource,
                  resourceId: resource.id,
                  isValid402: true,
                  success: true,
                };
              } else {
                console.info('resource responded with invalid x402 response', {
                  resource: resource.resource,
                  status,
                  errors: parsedResponse.errors,
                });
              }
            } catch {
              continue;
            }
          }
        }

        return {
          resource: resource.resource,
          resourceId: resource.id,
          isValid402: false,
          success: false,
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Resource ping task completed',
      validX402Responses: pingResults.filter(
        result => result.status === 'fulfilled' && result.value?.isValid402
      ).length,
      invalidX402Responses: pingResults.filter(
        result => result.status === 'fulfilled' && !result.value?.isValid402
      ).length,
      failedResponses: pingResults.filter(
        result => result.status === 'rejected'
      ).length,
      totalResponses: pingResults.length,
      resourcesPinged: pingResults.filter(
        result => result.status === 'fulfilled' && result.value?.success
      ).length,
      resourcesNotPinged: pingResults.filter(
        result => result.status === 'fulfilled' && !result.value?.success
      ).length,
      durationMs: Date.now() - startTime,
    });
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    const errorResult = {
      success: false,
      message: 'Ping task failed with error',
      error: error instanceof Error ? error.message : 'Unknown error',
      durationMs: totalDuration,
    };

    console.error('Resource ping task failed', {
      ...errorResult,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(errorResult);
  }
};
