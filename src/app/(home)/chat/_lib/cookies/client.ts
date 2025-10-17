import { setCookie } from 'cookies-next/client';

import { COOKIE_KEYS } from './keys';

export const clientCookieUtils = {
  setSelectedChatModel(model: string | undefined): void {
    setCookie(COOKIE_KEYS.SELECTED_CHAT_MODEL, model);
  },

  setResourceIds(resourceIds: string[]): void {
    setCookie(COOKIE_KEYS.RESOURCE_IDS, resourceIds);
  },
};
