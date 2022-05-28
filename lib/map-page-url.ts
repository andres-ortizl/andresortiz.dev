import { Block, ExtendedRecordMap } from 'notion-types'
import { uuidToId, parsePageId, getPageProperty } from 'notion-utils'

import { Site } from './types'
import { includeNotionIdInUrls } from './config'
import { getCanonicalPageId } from './get-canonical-page-id'

// include UUIDs in page URLs during local development but not in production
// (they're nice for debugging and speed up local dev)
const uuid = !!includeNotionIdInUrls

export const mapPageUrl =
  (site: Site, recordMap: ExtendedRecordMap, searchParams: URLSearchParams) =>
  (pageId = '') => {
    const pageUuid = parsePageId(pageId, { uuid: true })

    if (uuidToId(pageUuid) === site.rootNotionPageId) {
      return createUrl('/', searchParams)
    } else {
      return createUrl(
        `/${getCanonicalPageId(pageUuid, recordMap, { uuid })}`,
        searchParams
      )
    }
  }

export const getCanonicalPageUrl =
  (site: Site, recordMap: ExtendedRecordMap) =>
  (pageId = '') => {
    const pageUuid = parsePageId(pageId, { uuid: true })

    if (uuidToId(pageId) === site.rootNotionPageId) {
      return `https://${site.domain}`
    } else {
      return `https://${site.domain}/${getCanonicalPageId(pageUuid, recordMap, {
        uuid
      })}`
    }
  }

  /**
   * Return a url if the notion page has the property 'Redirect'm otherwise return undefined
   * @param site 
   * @param recordMap 
   * @param block 
   * @returns a url as string
   */
export const shouldRedirectToAnotherSite =
  (site: Site, recordMap: ExtendedRecordMap, block: Block) =>
  (pageId = '') => {
    const pageUuid = parsePageId(pageId, { uuid: true })

    // Search for a porperty named 'Redirect'
    const redirect = getPageProperty<string>('Redirect', block, recordMap) || undefined
    console.log('redirect: ',redirect)
    return redirect

  }

function createUrl(path: string, searchParams: URLSearchParams) {
  return [path, searchParams.toString()].filter(Boolean).join('?')
}
