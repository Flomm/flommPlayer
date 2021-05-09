import * as tags from 'jsmediatags';
import { jsmediatagsError, TagType } from 'jsmediatags/types';
import ITrackData from './ITrackData';
import ITrackSQLRow from './ITraclSQLRow';

export default async function tagParser(row: ITrackSQLRow): Promise<ITrackData> {
  return await new Promise((resolve) => {
    new tags.Reader(`${row.url}`).setTagsToRead(['title', 'artist']).read({
      onSuccess: function (tag: TagType) {
        resolve({ ...row, title: tag.tags.title, band: tag.tags.artist });
      },
      onError: function (error: jsmediatagsError) {
        console.log(error.type, error.info);
        resolve({ ...row, title: 'Unknown track', band: 'Unknown artist' });
      },
    });
  });
}
