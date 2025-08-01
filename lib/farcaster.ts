import { Configuration, NeynarAPIClient } from '@neynar/nodejs-sdk';
// import { FeedType, FilterType } from '@neynar/nodejs-sdk/build/api';

const client = new NeynarAPIClient(
  new Configuration({ apiKey: process.env.NEYNAR_API_KEY! })
);

export async function fetchTrendingCasts(limit = 5) {
  const { casts } = await client.fetchFeed({
    feedType: 'filter',
    filterType: 'global_trending',
    limit,
  });

  return casts.map((cast) => ({
    title: cast.text,
    subtitle: `by ${cast.author.display_name || cast.author.username}`,
    count: `${cast.reactions.likes_count + cast.reactions.recasts_count}`,
  }));
}
