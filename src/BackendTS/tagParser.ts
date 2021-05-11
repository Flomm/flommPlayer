import * as mm from 'music-metadata';
import ITrackData from './ITrackData';
import ITrackSQLRow from './ITraclSQLRow';

export default async function tagParser(row: ITrackSQLRow): Promise<ITrackData> {
  try {
    const metadata = await mm.parseFile(`${row.url}`);
    return {
      ...row,
      title: metadata.common.title,
      band: metadata.common.artist,
      duration: Math.round(metadata.format.duration),
    };
  } catch (error) {
    console.error(error.message);
  }
}
