import { prisma } from '@/services/db/client';
import {
  getAllResourceTags,
  createResourceTag,
  assignTagToResource,
} from '@/services/db/resource-tag';
import { type listResourcesWithPagination } from '@/services/db/resources';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { getTracer } from '@lmnr-ai/lmnr';

const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

// Extract the resource type from listResourcesWithPagination return value
type ResourceWithRelations = Awaited<
  ReturnType<typeof listResourcesWithPagination>
>['items'][number];

const labelingSchema = z.object({
  tag: z.string(),
});

const labelingPrompt = `Your task is to assign reasonable tags to each resource you are given.

_GUIDELINES_FOR_TAG_ASSIGNMENT_:
- The tags should be short and concise, one word only.
- You Are not allowed to create new tags. Re-using existing tags is always required..
- Your goal is to cluster resources into meaningful groups based on the tag they are assigned to.

_VERY IMPORTANT_:
- If and only if there is a clear category that the resource belongs to that is not already covered by an existing tag, you should create a new tag.
- Resources will expose a list of "accept bodies". These are different ways the resource can be invoked.


- Most resources will expose a single "default" accept body, which is the main way to invoke the resource.
- Each accept body will have a description of what it is, and what it does.
- The tag should be assigned to the resource, which should consider all of the accept objects provided to you.


To assign tags, you must output the name of the tag you are assigning.

{_RESOURCE_URL_}

{_RESOURCE_DESCRIPTIONS_}

{_CURRENT_AVAILABLE_TAGS_}
`;

export const labelingPass = async (
  resource: ResourceWithRelations,
  metadata: {
    sessionId: string;
  }
) => {
  const tags = await getAllResourceTags();
  const resourceDescription = `
    RESOURCE DESCRIPTIONS:
    ${resource.accepts.map(accept => `- ${accept.description}`).join('\n')}

    RESOURCE INPUT PARAMETERS   (if applicable):
    ${JSON.stringify(resource.accepts.map(accept => JSON.stringify(accept.outputSchema, null, 2)))}
    `;

  const prompt = labelingPrompt
    .replace('{_RESOURCE_URL_}', resource.resource.toString())
    .replace('{_RESOURCE_DESCRIPTIONS_}', resourceDescription)
    .replace(
      '{_CURRENT_AVAILABLE_TAGS_}',
      tags.map(tag => `- ${tag.name}`).join('\n')
    );

  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    prompt,
    schema: labelingSchema,
    temperature: 0.1,
    experimental_telemetry: {
      isEnabled: true,
      tracer: getTracer(),
      metadata: {
        resourceId: resource.id,
        sessionId: metadata.sessionId,
      },
    },
  });

  if (!result.object) {
    throw new Error('No tag found');
  }

  const tag = result.object.tag;
  const tagData = await prisma.tag.findFirst({ where: { name: tag } });
  if (!tagData) {
    const newTag = await createResourceTag({ name: tag, color: randomColor() });
    await assignTagToResource({ resourceId: resource.id, tagId: newTag.id });
    return { resource, tag: newTag };
  } else {
    await assignTagToResource({ resourceId: resource.id, tagId: tagData.id });
    return { resource, tag: tagData };
  }
};
