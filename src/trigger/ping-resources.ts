import { logger, schedules } from '@trigger.dev/sdk/v3';

import { parseX402Response } from '@/lib/x402/schema';
import { listResources } from '@/services/db/resources';
import { prisma } from '@/services/db/client';

export const pingResourcesTask = schedules.task({
  id: 'ping-resources',
  // Every 1 minute
  cron: '*/1 * * * *',
  // Set maxDuration to prevent tasks from running indefinitely
  maxDuration: 600, // 10 minutes max execution time
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async payload => {
    const startTime = Date.now();
    logger.info('Starting resource ping task', {
      timestamp: payload.timestamp,
      lastTimestamp: payload.lastTimestamp,
      scheduleId: payload.scheduleId,
    });

    try {
      // Step 1: Fetch all resources from database
      logger.info('Fetching all resources from database');
      const resources = await listResources();
      logger.info('Successfully fetched resources', {
        totalResources: resources.length,
        durationMs: Date.now() - startTime,
      });

      if (resources.length === 0) {
        logger.warn('No resources found in database');
        return {
          success: true,
          message: 'No resources to ping',
          resourcesPinged: 0,
          durationMs: Date.now() - startTime,
        };
      }

      // Step 2: Ping all resources and store responses
      logger.info('Starting resource ping processing');

      const pingResults = await Promise.allSettled(
        resources.map(async resource => {
          return logger.trace('Pinging resource', async span => {
            span.setAttributes({
              resource: resource.resource,
              resourceId: resource.id,
            });

            for (const method of ['GET', 'POST']) {
              span.addEvent('pinging resource', {
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
                  const parsedResponse = parseX402Response(
                    await response.json()
                  );
                  if (parsedResponse.success) {
                    span.addEvent(
                      'resource responded with valid x402 response',
                      {
                        resource: resource.resource,
                        status,
                      }
                    );
                    await prisma.resourceResponse.upsert({
                      where: {
                        resourceId: resource.id,
                      },
                      update: {
                        resourceId: resource.id,
                        response: parsedResponse.data,
                      },
                      create: {
                        resourceId: resource.id,
                        response: parsedResponse.data,
                      },
                    });
                    return {
                      resource: resource.resource,
                      resourceId: resource.id,
                      isValid402: true,
                      success: true,
                    };
                  } else {
                    span.addEvent(
                      'resource responded with invalid x402 response',
                      {
                        resource: resource.resource,
                        status,
                        errors: parsedResponse.errors,
                      }
                    );
                  }
                } catch {
                  continue;
                }
              } else {
                span.addEvent('resource not 402', {
                  method,
                  status,
                });
              }
            }
            return {
              resource: resource.resource,
              resourceId: resource.id,
              isValid402: false,
              success: false,
            };
          });
        })
      );

      return {
        success: true,
        message: 'Resource ping task completed',
        validX402Responses: pingResults.filter(
          result => result.status === 'fulfilled' && result.value.isValid402
        ).length,
        invalidX402Responses: pingResults.filter(
          result => result.status === 'fulfilled' && !result.value.isValid402
        ).length,
        failedResponses: pingResults.filter(
          result => result.status === 'rejected'
        ).length,
        totalResponses: pingResults.length,
        resourcesPinged: pingResults.filter(
          result => result.status === 'fulfilled' && result.value.success
        ).length,
        resourcesNotPinged: pingResults.filter(
          result => result.status === 'fulfilled' && !result.value.success
        ).length,
        durationMs: Date.now() - startTime,
      };
    } catch (error) {
      const totalDuration = Date.now() - startTime;
      const errorResult = {
        success: false,
        message: 'Ping task failed with error',
        error: error instanceof Error ? error.message : 'Unknown error',
        durationMs: totalDuration,
        timestamp: payload.timestamp,
      };

      logger.error('Resource ping task failed', {
        ...errorResult,
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw error; // Re-throw to trigger retry mechanism
    }
  },
});
