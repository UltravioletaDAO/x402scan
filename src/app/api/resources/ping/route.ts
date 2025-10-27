import { listResources } from '@/services/db/resources/resource';

import { parseX402Response } from '@/lib/x402/schema';
import { checkCronSecret } from '@/lib/cron';
import { NextResponse, type NextRequest } from 'next/server';
import {
  deleteResourceResponse,
  upsertResourceResponse,
} from '@/services/db/resources/response';

export const GET = async (request: NextRequest) => {
  const cronCheck = checkCronSecret(request);
  if (cronCheck) {
    return cronCheck;
  }

  try {
    // Step 1: Fetch all resources from database
    console.info('Fetching all resources from database');
    const resources = await listResources();
    console.info('Successfully fetched resources', {
      totalResources: resources.length,
    });

    if (resources.length === 0) {
      console.warn('No resources found in database');
      return NextResponse.json(
        {
          success: true as const,
          message: 'No resources to ping',
          resourcesPinged: 0,
        },
        { status: 200 }
      );
    }

    const pingResults: Array<
      | {
          status: 'fulfilled';
          value: {
            resource: string;
            resourceId: string;
            isValid402: boolean;
            success: boolean;
          };
        }
      | {
          status: 'rejected';
          reason: unknown;
        }
    > = [];

    for (const resource of resources) {
      let handled = false;
      for (const method of ['GET', 'POST']) {
        try {
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
                await upsertResourceResponse(resource.id, parsedResponse.data);
                pingResults.push({
                  status: 'fulfilled',
                  value: {
                    resource: resource.resource,
                    resourceId: resource.id,
                    isValid402: true,
                    success: true,
                  },
                });
                handled = true;
                break;
              } else {
                console.info('resource responded with invalid x402 response', {
                  resource: resource.resource,
                  status,
                  errors: parsedResponse.errors,
                });
              }
            } catch (err) {
              console.error('Failed to upsert resource response', {
                resourceId: resource.id,
                error: err,
              });
              // Parsing or upserting failed, try next method
              continue;
            }
          }
        } catch (err) {
          // Fetch failed - capture as a rejection and stop further attempts for this resource
          pingResults.push({
            status: 'rejected',
            reason: err,
          });
          handled = true;
          break;
        }
      }

      if (!handled) {
        try {
          await deleteResourceResponse(resource.id);
        } catch (err) {
          console.error('Failed to delete resource response', {
            resourceId: resource.id,
            error: err,
          });
        }
        pingResults.push({
          status: 'fulfilled',
          value: {
            resource: resource.resource,
            resourceId: resource.id,
            isValid402: false,
            success: false,
          },
        });
      }
    }

    return NextResponse.json({
      success: true as const,
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
    });
  } catch (error) {
    const errorResult = {
      success: false as const,
      message: 'Ping task failed with error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    console.error('Resource ping task failed', {
      ...errorResult,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(errorResult);
  }
};
