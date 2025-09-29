import { logger, schedules } from '@trigger.dev/sdk/v3';

import { upsertResource } from '@/services/db/resources';
import { listFacilitatorResources } from '@/services/cdp/facilitator/list-resources';
import { scrapeOg } from '@/services/scraper/og';
import { scrapeMetadata } from '@/services/scraper/metadata';
import { upsertOrigin } from '@/services/db/origin';
import { getOriginFromUrl } from '@/lib/url';

export const syncResourcesTask = schedules.task({
  id: 'sync-resources',
  // Every 5 minutes
  cron: '*/5 * * * *',
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
    logger.info('Starting resource sync task', {
      timestamp: payload.timestamp,
      lastTimestamp: payload.lastTimestamp,
      scheduleId: payload.scheduleId,
    });

    try {
      // Step 1: Fetch facilitator resources
      logger.info('Fetching facilitator resources from CDP');
      const resources = await listFacilitatorResources();
      logger.info('Successfully fetched facilitator resources', {
        totalResources: resources.items.length,
        durationMs: Date.now() - startTime,
      });

      if (resources.items.length === 0) {
        logger.warn('No resources found from facilitator');
        return {
          success: true,
          message: 'No resources to sync',
          resourcesProcessed: 0,
          originsProcessed: 0,
          durationMs: Date.now() - startTime,
        };
      }

      // Step 2: Extract unique origins
      logger.info('Extracting unique origins from resources');
      const origins = new Set<string>();
      for (const resource of resources.items) {
        try {
          const origin = getOriginFromUrl(resource.resource);
          origins.add(origin);
        } catch (error) {
          logger.warn('Failed to extract origin from resource', {
            resource: resource.resource,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      const uniqueOrigins = Array.from(origins);
      logger.info('Extracted unique origins', {
        totalOrigins: uniqueOrigins.length,
        origins: uniqueOrigins.slice(0, 10), // Log first 10 for debugging
      });

      // Step 3: Process origins (scrape metadata and OG data)
      logger.info('Starting origin processing with metadata scraping');
      const originProcessingStart = Date.now();

      const originResults = await Promise.allSettled(
        uniqueOrigins.map(async origin => {
          const originStart = Date.now();
          logger.debug('Processing origin', { origin });

          try {
            // Scrape OG and metadata in parallel
            const [og, metadata] = await Promise.all([
              scrapeOg(origin).catch(error => {
                logger.warn('Failed to scrape OG data', {
                  origin,
                  error:
                    error instanceof Error ? error.message : 'Unknown error',
                });
                return null;
              }),
              scrapeMetadata(origin).catch(error => {
                logger.warn('Failed to scrape metadata', {
                  origin,
                  error:
                    error instanceof Error ? error.message : 'Unknown error',
                });
                return null;
              }),
            ]);

            // Prepare origin data
            const originData = {
              origin: origin,
              title: metadata?.title ?? og?.ogTitle,
              description: metadata?.description ?? og?.ogDescription,
              favicon:
                og?.favicon &&
                (og.favicon.startsWith('/')
                  ? origin.replace(/\/$/, '') + og.favicon
                  : og.favicon),
              ogImages:
                og?.ogImage?.map(image => ({
                  url: image.url,
                  height: image.height,
                  width: image.width,
                  title: og.ogTitle,
                  description: og.ogDescription,
                })) ?? [],
            };

            // Upsert origin to database
            await upsertOrigin(originData);

            logger.debug('Successfully processed origin', {
              origin,
              hasTitle: !!originData.title,
              hasDescription: !!originData.description,
              hasFavicon: !!originData.favicon,
              ogImagesCount: originData.ogImages.length,
              durationMs: Date.now() - originStart,
            });

            return { origin, success: true };
          } catch (error) {
            logger.error('Failed to process origin', {
              origin,
              error: error instanceof Error ? error.message : 'Unknown error',
              stack: error instanceof Error ? error.stack : undefined,
              durationMs: Date.now() - originStart,
            });
            return { origin, success: false, error };
          }
        })
      );

      // Analyze origin processing results
      const successfulOrigins = originResults.filter(
        (
          result
        ): result is PromiseFulfilledResult<{
          origin: string;
          success: true;
        }> => result.status === 'fulfilled' && result.value.success
      ).length;
      const failedOrigins = originResults.length - successfulOrigins;

      logger.info('Completed origin processing', {
        totalOrigins: uniqueOrigins.length,
        successful: successfulOrigins,
        failed: failedOrigins,
        durationMs: Date.now() - originProcessingStart,
      });

      // Step 4: Process resources (upsert to database)
      logger.info('Starting resource processing');
      const resourceProcessingStart = Date.now();

      const resourceResults = await Promise.allSettled(
        resources.items.map(async facilitatorResource => {
          const resourceStart = Date.now();
          logger.debug('Processing resource', {
            resource: facilitatorResource.resource,
          });

          try {
            await upsertResource(facilitatorResource);
            logger.debug('Successfully processed resource', {
              resource: facilitatorResource.resource,
              durationMs: Date.now() - resourceStart,
            });
            return { resource: facilitatorResource.resource, success: true };
          } catch (error) {
            logger.error('Failed to process resource', {
              resource: facilitatorResource.resource,
              error: error instanceof Error ? error.message : 'Unknown error',
              stack: error instanceof Error ? error.stack : undefined,
              durationMs: Date.now() - resourceStart,
            });
            return {
              resource: facilitatorResource.resource,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            };
          }
        })
      );

      // Analyze resource processing results
      const successfulResources = resourceResults.filter(
        (
          result
        ): result is PromiseFulfilledResult<{
          resource: string;
          success: true;
        }> => result.status === 'fulfilled' && result.value.success
      ).length;
      const failedResources = resourceResults.length - successfulResources;

      logger.info('Completed resource processing', {
        totalResources: resources.items.length,
        successful: successfulResources,
        failed: failedResources,
        durationMs: Date.now() - resourceProcessingStart,
      });

      // Final summary
      const totalDuration = Date.now() - startTime;
      const result = {
        success: true,
        message: `Sync completed successfully`,
        resourcesProcessed: successfulResources,
        resourcesFailed: failedResources,
        originsProcessed: successfulOrigins,
        originsFailed: failedOrigins,
        durationMs: totalDuration,
        timestamp: payload.timestamp,
      };

      logger.info('Resource sync task completed successfully', result);
      return result;
    } catch (error) {
      const totalDuration = Date.now() - startTime;
      const errorResult = {
        success: false,
        message: 'Sync task failed with error',
        error: error instanceof Error ? error.message : 'Unknown error',
        durationMs: totalDuration,
        timestamp: payload.timestamp,
      };

      logger.error('Resource sync task failed', {
        ...errorResult,
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw error; // Re-throw to trigger retry mechanism
    }
  },
});
